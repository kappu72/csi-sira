/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');
const {isObject} = require('lodash');

// include application component
const QueryBuilder = require('../../MapStore2/web/client/components/data/query/QueryBuilder');
const {Panel, Glyphicon, Modal} = require('react-bootstrap');

const {bindActionCreators} = require('redux');

const Draggable = require('react-draggable');

const LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');
const I18N = require('../../MapStore2/web/client/components/I18N/I18N');

require('../../assets/css/sira.css');

const {
    // QueryBuilder action functions
    addGroupField,
    addFilterField,
    removeFilterField,
    updateFilterField,
    updateExceptionField,
    updateLogicCombo,
    removeGroupField,
    changeCascadingValue,
    expandAttributeFilterPanel,
    expandSpatialFilterPanel,
    selectSpatialMethod,
    selectSpatialOperation,
    removeSpatialSelection,
    showSpatialSelectionDetails,
    query,
    reset
} = require('../../MapStore2/web/client/actions/queryform');

const {
    // SiraQueryPanel action functions
    expandFilterPanel
} = require('../actions/queryform');

const {
    changeDrawingStatus,
    endDrawing
} = require('../../MapStore2/web/client/actions/draw');

const SiraQueryPanel = React.createClass({
    propTypes: {
        // Sira Query Panel props
        removeButtonIcon: React.PropTypes.string,
        filterPanelExpanded: React.PropTypes.bool,
        loadingQueryFormConfigError: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        header: React.PropTypes.string,
        datasetHeader: React.PropTypes.string,
        featureTypeName: React.PropTypes.string,
        siraActions: React.PropTypes.object,
        // QueryBuilder props
        useMapProjection: React.PropTypes.bool,
        attributes: React.PropTypes.array,
        filterFields: React.PropTypes.array,
        groupLevels: React.PropTypes.number,
        groupFields: React.PropTypes.array,
        spatialField: React.PropTypes.object,
        showDetailsPanel: React.PropTypes.bool,
        toolbarEnabled: React.PropTypes.bool,
        searchUrl: React.PropTypes.string,
        attributePanelExpanded: React.PropTypes.bool,
        spatialPanelExpanded: React.PropTypes.bool,
        queryFormActions: React.PropTypes.object
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            // Sira Query Panel default props
            removeButtonIcon: "glyphicon glyphicon-trash",
            filterPanelExpanded: true,
            loadingQueryFormConfigError: null,
            header: "queryform.form.header",
            datasetHeader: "queryform.form.dataset_header",
            featureTypeName: null,
            siraActions: {
                onExpandFilterPanel: () => {}
            },
            // QueryBuilder default props
            useMapProjection: true,
            attributes: [],
            groupLevels: 1,
            groupFields: [],
            filterFields: [],
            spatialField: {},
            attributePanelExpanded: true,
            spatialPanelExpanded: true,
            showDetailsPanel: false,
            toolbarEnabled: true,
            searchUrl: "",
            queryFormActions: {
                attributeFilterActions: {
                    onAddGroupField: () => {},
                    onAddFilterField: () => {},
                    onRemoveFilterField: () => {},
                    onUpdateFilterField: () => {},
                    onUpdateExceptionField: () => {},
                    onUpdateLogicCombo: () => {},
                    onRemoveGroupField: () => {},
                    onChangeCascadingValue: () => {},
                    onExpandAttributeFilterPanel: () => {}
                },
                spatialFilterActions: {
                    onExpandSpatialFilterPanel: () => {},
                    onSelectSpatiaslMethod: () => {},
                    onSelectSpatialOperation: () => {},
                    onChangeDrawingStatus: () => {},
                    onRemoveSpatialSelection: () => {},
                    onShowSpatialSelectionDetails: () => {},
                    onEndDrawing: () => {}
                },
                queryToolbarActions: {
                    onQuery: () => {},
                    onReset: () => {},
                    onChangeDrawingStatus: () => {}
                }
            }
        };
    },
    renderHeader() {
        const header = LocaleUtils.getMessageById(this.context.messages, this.props.header);

        const heading = this.props.filterPanelExpanded ? (
            <span>
                <span>{header}</span>
                <button onClick={this.props.siraActions.onExpandFilterPanel.bind(null, false)} className="close">
                    <Glyphicon glyph="glyphicon glyphicon-collapse-down collapsible"/>
                </button>
            </span>
        ) : (
            <span>
                <span>{header}</span>
                <button onClick={this.props.siraActions.onExpandFilterPanel.bind(null, true)} className="close">
                    <Glyphicon glyph="glyphicon glyphicon-expand collapsible"/>
                </button>
            </span>
        );

        return (
            <div className="handle_querypanel">
                {heading}
            </div>
        );
    },
    renderDatasetHeader() {
        const datasetHeader = LocaleUtils.getMessageById(this.context.messages, this.props.datasetHeader);
        return (
            <div className="dhContainer">
                <h4>{datasetHeader}</h4>
                <h4 className="ftheader">{this.props.featureTypeName}</h4>
            </div>
        );
    },
    renderQueryPanel() {
        return (
            <Draggable start={{x: 670, y: 15}} handle=".handle_querypanel">
                <Panel className="querypanel-container" collapsible expanded={this.props.filterPanelExpanded} header={this.renderHeader()} bsStyle="primary">
                    {this.renderDatasetHeader()}
                    <QueryBuilder
                        useMapProjection={this.props.useMapProjection}
                        removeButtonIcon={this.props.removeButtonIcon}
                        groupLevels={this.props.groupLevels}
                        groupFields={this.props.groupFields}
                        filterFields={this.props.filterFields}
                        spatialField={this.props.spatialField}
                        attributes={this.props.attributes}
                        showDetailsPanel={this.props.showDetailsPanel}
                        toolbarEnabled={this.props.toolbarEnabled}
                        searchUrl={this.props.searchUrl}
                        attributePanelExpanded={this.props.attributePanelExpanded}
                        spatialPanelExpanded={this.props.spatialPanelExpanded}
                        attributeFilterActions={this.props.queryFormActions.attributeFilterActions}
                        spatialFilterActions={this.props.queryFormActions.spatialFilterActions}
                        queryToolbarActions={this.props.queryFormActions.queryToolbarActions}/>
                </Panel>
            </Draggable>
        );
    },
    renderLoadConfigException() {
        let exception;
        if (isObject(this.props.loadingQueryFormConfigError)) {
            exception = this.props.loadingQueryFormConfigError.status +
                "(" + this.props.loadingQueryFormConfigError.statusText + ")" +
                ": " + this.props.loadingQueryFormConfigError.data;
        } else {
            exception = this.props.loadingQueryFormConfigError;
        }

        return (
            <Modal show={this.props.loadingQueryFormConfigError ? true : false} bsSize="small">
                <Modal.Header closeButton>
                    <Modal.Title><I18N.Message msgId={"queryform.config.load_config_exception"}/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mapstore-error">{exception}</div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        );
    },
    render() {
        if (this.props.loadingQueryFormConfigError) {
            return (
                this.renderLoadConfigException()
            );
        }

        return this.props.attributes ?
            (
                this.renderQueryPanel()
            ) : (
                <span/>
            );
    }
});

module.exports = connect((state) => {
    return {
        // SiraQueryPanel prop
        filterPanelExpanded: state.queryformconfig.filterPanelExpanded,
        loadingQueryFormConfigError: state.queryformconfig.loadingQueryFormConfigError,
        featureTypeName: state.queryformconfig.featureTypeName,
        // QueryBuilder props
        groupLevels: state.queryform.groupLevels,
        groupFields: state.queryform.groupFields,
        filterFields: state.queryform.filterFields,
        attributes: state.queryformconfig.attributes,
        spatialField: state.queryform.spatialField,
        showDetailsPanel: state.queryform.showDetailsPanel,
        toolbarEnabled: state.queryform.toolbarEnabled,
        attributePanelExpanded: state.queryform.attributePanelExpanded,
        spatialPanelExpanded: state.queryform.spatialPanelExpanded,
        useMapProjection: state.queryform.useMapProjection,
        searchUrl: state.queryform.searchUrl
    };
}, dispatch => {
    return {
        siraActions: bindActionCreators({
            // SiraQueryPanel actions
            onExpandFilterPanel: expandFilterPanel
        }, dispatch),
        queryFormActions: {
            // QueryBuilder actions
            attributeFilterActions: bindActionCreators({
                onAddGroupField: addGroupField,
                onAddFilterField: addFilterField,
                onRemoveFilterField: removeFilterField,
                onUpdateFilterField: updateFilterField,
                onUpdateExceptionField: updateExceptionField,
                onUpdateLogicCombo: updateLogicCombo,
                onRemoveGroupField: removeGroupField,
                onChangeCascadingValue: changeCascadingValue,
                onExpandAttributeFilterPanel: expandAttributeFilterPanel
            }, dispatch),
            spatialFilterActions: bindActionCreators({
                onExpandSpatialFilterPanel: expandSpatialFilterPanel,
                onSelectSpatialMethod: selectSpatialMethod,
                onSelectSpatialOperation: selectSpatialOperation,
                onChangeDrawingStatus: changeDrawingStatus,
                onRemoveSpatialSelection: removeSpatialSelection,
                onShowSpatialSelectionDetails: showSpatialSelectionDetails,
                onEndDrawing: endDrawing
            }, dispatch),
            queryToolbarActions: bindActionCreators({
                onQuery: query,
                onReset: reset,
                onChangeDrawingStatus: changeDrawingStatus
            }, dispatch)
        }
    };
})(SiraQueryPanel);
