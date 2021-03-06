/**
 * @fileoverview 문자열 조작 모듈
 * @author FE개발팀
 */

(function(ne) {
    'use strict';

    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 전달된 문자열에 모든 HTML Entity 타입의 문자열을 원래의 문자로 반환
     * @param {String} htmlEntity HTML Entity 타입의 문자열
     * @return {String} 원래 문자로 변환된 문자열
     * @memberof ne.util
     * @example
     var htmlEntityString = "A &#39;quote&#39; is &lt;b&gt;bold&lt;/b&gt;"
     var result = decodeHTMLEntity(htmlEntityString); //결과값 : "A 'quote' is <b>bold</b>"
     */
    function decodeHTMLEntity(htmlEntity) {
        var entities = {'&quot;' : '"', '&amp;' : '&', '&lt;' : '<', '&gt;' : '>', '&#39;' : '\'', '&nbsp;' : ' '};
        return htmlEntity.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, function(m0) {
            return entities[m0] ? entities[m0] : m0;
        });
    }

    /**
     * 전달된 문자열을 HTML Entity 타입의 문자열로 반환
     * @param {String} html HTML 문자열
     * @return {String} HTML Entity 타입의 문자열로 변환된 문자열
     * @memberof ne.util
     * @example
     var htmlEntityString = "<script> alert('test');</script><a href='test'>";
     var result = encodeHTMLEntity(htmlEntityString);
     //결과값 : "&lt;script&gt; alert(&#39;test&#39;);&lt;/script&gt;&lt;a href=&#39;test&#39;&gt;"
     */
    function encodeHTMLEntity(html) {
        var entities = {'"': 'quot', '&': 'amp', '<': 'lt', '>': 'gt', '\'': '#39'};
        return html.replace(/[<>&"']/g, function(m0) {
            return entities[m0] ? '&' + entities[m0] + ';' : m0;
        });
    }

    /**
     * html Entity 로 변환할 수 있는 문자가 포함되었는지 확인
     * @param {String} string
     * @memberof ne.util
     * @return {boolean}
     */
    function hasEncodableString(string) {
        return /[<>&"']/.test(string);
    }

    ne.util.decodeHTMLEntity = decodeHTMLEntity;
    ne.util.encodeHTMLEntity = encodeHTMLEntity;
    ne.util.hasEncodableString = hasEncodableString;
})(window.ne);
