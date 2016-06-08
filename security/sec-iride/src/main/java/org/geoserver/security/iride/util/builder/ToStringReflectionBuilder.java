package org.geoserver.security.iride.util.builder;

import static org.apache.commons.lang3.builder.ToStringBuilder.reflectionToString;

import org.apache.commons.lang3.builder.ToStringStyle;

/**
 *
 * @author "Simone Cornacchia - seancrow76@gmail.com, simone.cornacchia@consulenti.csi.it (CSI:71740)"
 */
public final class ToStringReflectionBuilder {

    /**
     * A singleton {@link ToStringStyle} instance, configured as follows:
     * <ul>
     *     <li><code>arrayStart</code>: <code>"["</code></li>
     *     <li><code>arrayEnd</code>: <code>"]"</code></li>
     *     <li><code>contentStart</code>: <code>"("</code></li>
     *     <li><code>fieldSeparator</code>: <code>{@link org.apache.commons.lang3.SystemUtils.LINE_SEPARATOR} + "  "</code></li>
     *     <li><code>fieldSeparatorAtStart</code>: <code>true</code></li>
     *     <li><code>contentEnd</code>: <code>{@link org.apache.commons.lang3.SystemUtils.LINE_SEPARATOR} + ")"</code></li>
     *     <li><code>useShortClassName</code>: <code>true</code></li>
     *     <li><code>nullText</code>: <code>"&lt;NULL&gt;"</code></li>
     * </ul>
     */
    public static final ToStringStyle TO_STRING_STYLE = new MultilineRecursiveToStringStyle() {

        private static final long serialVersionUID = -7977293159579371869L;

    {
    	this.setUseShortClassName(true);
        this.setNullText("<NULL>");
    }};


    /**
     * Restituisce una rappresentazione testuale,
     * ottenuta tramite <code>Reflection API</code>, dell'oggetto fornito.
     *
     * @see ToStringBuilder#reflectionToString(Object, org.apache.commons.lang3.builder.ToStringStyle)
     * @param object l'oggetto di cui fornire una rappresentazione testuale,
     *        ottenuta tramite <code>Reflection API</code>
     * @return una rappresentazione testuale,
     *         ottenuta tramite <code>Reflection API</code>, dell'oggetto fornito.
     */
    public static <T> String reflectToString(T object) {
        return reflectionToString((T) object, TO_STRING_STYLE);
    }

    /**
     * Constructor.
     */
    private ToStringReflectionBuilder() {
        /* NO-OP */
    }

}