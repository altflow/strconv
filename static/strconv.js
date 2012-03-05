/**
 * strconv.js
 * string converter which can convert string to
 *   - URL encoding
 *   - Unicode escape
 *
 * @requires  yahoo, dom, evnet, button, tabview, connect, json
 * @module    strconv
 * @namespace YAHOO.strconv
 */

YAHOO.namespace("strconv");

// Aliases
var YuiButtonGroup  = YAHOO.widget.ButtonGroup,
    YuiConnect      = YAHOO.util.Connect,
    YuiDom          = YAHOO.util.Dom,
    YuiEvent        = YAHOO.util.Event,
    YuiJson         = YAHOO.lang.JSON,
    YuiTabView      = YAHOO.widget.TabView;

/**
 * Controller
 * @class Controller
 */
YAHOO.strconv.Controller = function(){
    
    // Private
    var _oButtonGroupUnicode,
        _oButtonGroupEncoding,
        _oButtonGroupOperation,
        _oTabs;
        
    /**
     * Event hander for input text in textarea
     * This invokes appropriate function according to selected options
     * 
     * @method  _convert
     * @private
     * @param   {object} Event
     * @return  {void}
     */
    var _convert = function(oEvent){
        YAHOO.log("Controller._convert method fired by " + oEvent.type);
        var sInput      = YuiDom.get("input-str").value,
            sConverted  = "",
            sActiveTab  = YuiDom.getElementsByClassName("selected", "li", "tab")[0].id,
            oCallback   = YAHOO.strconv.Controller.showConverted;
        
        if (!sInput) {
            return;
        }
        
        switch (sActiveTab) {
            case "url-encoding":
                var sOperation = YuiDom.getElementsByClassName("yui-radio-button-checked", "span", "url-encoding-operation")[0].id,
                    sEncoding  = YuiDom.getElementsByClassName("yui-radio-button-checked", "span", "encoding")[0].id;
                
                sOperation = sOperation.replace(/^url\-/, "");
                sEncoding  = sEncoding.replace(/^encoding\-/, "");
                sConverted = YAHOO.strconv.UrlEncode.convert(sInput, sOperation, sEncoding, oCallback);
                break;
            
            case "unicode-escaping":
                YAHOO.log("escaping unicode");
                var sUnicodeOption = YuiDom.getElementsByClassName("yui-radio-button-checked", "span", "unicode-option")[0].id;
                sUnicodeOption = sUnicodeOption.replace(/^unicode\-/, "");
                
                sConverted = YAHOO.strconv.UnicodeEscape.convert(sInput, sUnicodeOption, oCallback);
                break;
            
            case "json-formatter":
                YAHOO.log("formatting json string");
                var nIndentNum = parseInt(YuiDom.get("indent-num").value),
                    oJson      = YuiJson.parse(sInput);
                
                sConverted = YuiJson.stringify(oJson, null, nIndentNum);
                oCallback(sConverted);
                break;
        }
    };
    
    // Initialize page elements with YUI widgets
    YuiEvent.onDOMReady(function(){
        // Create YUI Log Reader
        var oConfig    = {
            width:  "20em",
            height: "20em",
            bottom: "0px",
            left:   "0px"
        }
        //var oLogReader = new YAHOO.widget.LogReader(null, oConfig);
        
        // Initialize radio buttons with YUI Button
        _oButtonGroupUnicode   = new YuiButtonGroup("unicode-option"),
        _oButtonGroupEncoding  = new YuiButtonGroup("encoding"),
        _oButtonGroupOperation = new YuiButtonGroup("url-encoding-operation");
        
        // Initialize the page with YUI TabView
        _oTabs = new YuiTabView("right-column");
        
        // Event listener to textarea input, active tab change and option change
        YuiEvent.addListener("input-str", "keyup", _convert);
        _oTabs.addListener("activeTabChange", _convert)
        _oButtonGroupUnicode.addListener("checkedButtonChange", _convert);
        _oButtonGroupEncoding.addListener("checkedButtonChange", _convert);
        _oButtonGroupOperation.addListener("checkedButtonChange", _convert);
        YuiEvent.addListener("indent-num", "keyup", _convert);
        
        YuiEvent.addListener("select-input-str", "click", function(){
            var oTextArea = YuiDom.get("input-str");
            oTextArea.select();
            oTextArea.focus();
        });

        YuiEvent.addListener("select-converted-str", "click", function(){
            var oTextArea = YuiDom.get("converted-str");
            oTextArea.select();
            oTextArea.focus();
        });
    });
    
    return {
        /**
         * render converted result in textarea
         * @method showConverted
         * @param  {string} Converted
         * @return {void}
         */
        showConverted: function(sConverted){
            YAHOO.log("show converted string");
            YuiDom.get("converted-str").value = sConverted;
        }
    };
}();

/**
 * Escape/unescape Unicode
 * @class UnicodeEscape
 */
YAHOO.strconv.UnicodeEscape = function(){    
    
    /**
     * Escape string
     * @method _escape
     * @private
     * @param  {string} Text
     * @return {string} Escaped text
     */
    var _escape = function(sText){
        var sEscaped = sText.replace(/</g,'&lt;');
        sEscaped = sEscaped.replace(/>/g,'&gt;');
        
        sEscaped = sEscaped.replace(/[^ -~]|\\/g, function(m){
            var code= m.charCodeAt(0);
            return '\\u'
                    + ( (code<0x10) ? '000' : (code<0x100) ? '00' : (code<0x1000) ? '0' : '' )
                    + code.toString(16);
        });
        
        return sEscaped;
    };
    
    /**
     * Unescape string
     * @method _unescape
     * @private
     * @param  {string} Text
     * @return {string} Unescaped text
     */
    var _unescape = function(sText){
        var sUnescaped = sText.replace(/\\u([a-fA-F0-9]{4})/g, function(m0, m1){
            return String.fromCharCode( parseInt(m1, 16) );
        });
        
        return sUnescaped;
    };
    
    return {
        /**
         * escape/unescape string to/from unicode
         * @method convert
         * @param  {string} Text
         * @param  {string} Operation escape or unescape
         * @param  {object} Callback function
         * @return {string} Converted string
         */
        convert: function(sText, sOperation, oCallback){
            YAHOO.log("convert with UnicodeEscape");
            
            var sConverted = "";
            
            switch(sOperation) {
                case "escape":
                    sConverted = _escape(sText);
                    break;
                case "unescape":
                    sConverted = _unescape(sText);
                    break;
            }
            
            if (oCallback) {
                oCallback(sConverted);
            }
            
            return sConverted;
        }
    }
}();

/**
 * url encode/decode
 * @class UrlEncode
 */
YAHOO.strconv.UrlEncode = function(){    
    var _url = "/urlencode";
    
    /**
     * decode URL encoded text
     * @method  _decode
     * @private
     * @param   {string} Text
     * @param   {string} Encoding utf-8, shift_jis, euc-jp, iso-2022-jp (jis)
     * @param   {object} Callback function
     * @return  {string|null} Converted text or null if encoding is not UTF-8
     */
    var _decode = function(sText, sEncoding, oCallback){
        var sConverted = null;
        
        if (sEncoding === "utf-8") {
            sConverted = decodeURIComponent(sText);
        } else {
            _sendRequest(sText, "decode", sEncoding, oCallback);
        }
        
        return sConverted;
    };
    
    /**
     * encode text to URL encoding
     * @method  _encode
     * @private
     * @param   {string} Text
     * @param   {string} Encoding utf-8, shift_jis, euc-jp, iso-2022-jp (jis)
     * @param   {object} Callback function
     * @return  {string|null} Converted text or null if encoding is not UTF-8
     */
    var _encode = function(sText, sEncoding, oCallback){
        var sConverted = null;
        
        if (sEncoding === "utf-8") {
            sConverted = encodeURIComponent(sText);
        } else {
            _sendRequest(sText, "encode", sEncoding, oCallback);
        }
        
        return sConverted;
    };
    
    /**
     * invoked when async request successfully complete
     * @method  _onSuccess
     * @private
     * @param   {object} Params parameters contains status, responseText, argument
     * @return  {void}
     */
    var _onSuccess = function(oParams){
        if (oParams.responseText && oParams.argument[0]) {
            // argument[0] is callback function that was set in _sendRequest
            oParams.argument[0](oParams.responseText);
        }
    };
    
    /**
     * throws error when async request failure
     * @method _onFailure
     * @private
     * @param   {object} Params parameters contains status, statusText
     * @return  {void}
     */
    var _onFailure = function(oParams){
        throw new Error("Could not received converted text. " + oParams.status + ": " + oParams.statusText);
    };
    
    /**
     * delegate convert function to server side script
     * @method  _sendRequest
     * @private
     * @param   {string} Text
     * @param   {string} Operation
     * @param   {string} Encoding utf-8, shift_jis, euc-jp, iso-2022-jp (jis)
     * @param   {object} Callback function
     * @return  {void}
     */
    var _sendRequest = function(sText, sOperation, sEncoding, oCallback){
        var oHandler = {
                success: _onSuccess,
                failure: _onFailure,
                timeout: 5000,
                argument: [oCallback]
            },
            sPostData = "text=" + encodeURIComponent(sText)
                      + "&encoding=" + sEncoding
                      + "&operation=" + sOperation;
        
        YuiConnect.asyncRequest("POST", _url, oHandler, sPostData);
    };
    
    return {
        /**
         * encode/decode string to/from URL encoding
         * @method convert
         * @param  {string} Text
         * @param  {string} Operation
         * @param  {string} Encoding utf-8, shift_jis, euc-jp, iso-2022-jp (jis)
         * @param  {object} Callback function
         * @return {string|null} Converted string or null if encoding is not UTF-8
         */
        convert: function(sText, sOperation, sEncoding, oCallback){
            YAHOO.log("convert with UrlEncoding: " + sOperation + ", " + sEncoding);
            
            var sConverted = null;
            
            switch(sOperation) {
                case "encode":
                    sConverted = _encode(sText, sEncoding, oCallback);
                    break;
                case "decode":
                    sConverted = _decode(sText, sEncoding, oCallback);
                    break;
            }
            
            if (sConverted && oCallback) {
                oCallback(sConverted);
            }
            
            return sConverted;
        }
    };
}();
