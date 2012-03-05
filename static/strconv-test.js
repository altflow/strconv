/**
 * strconv-test.js
 * automation test strconv.js
 * @requires yahoo, dom, event, logger, test, srtconv.js
 * @module   strconv-test
 * @namespace YAHOO.strconv.Test
 */
YAHOO.strconv.Test = new YAHOO.tool.TestSuite({
    name: "Strconv Test",
    setUp: function(){
        this.data = {
            originalText:    "あいうえお",
            urlEncodedUtf8:  "%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A",
            urlEncodedSjis:  "%82%A0%82%A2%82%A4%82%A6%82%A8",
            urlEncodedEuc:   "%A4%A2%A4%A4%A4%A6%A4%A8%A4%AA",
            urlEncodedJis:   "%1B%24B%24%22%24%24%24%26%24%28%24%2A%1B%28B",
            unicodeEscaped:  "\\u3042\\u3044\\u3046\\u3048\\u304A",
            originalJsonStr: '{"key1":{"key2":"value2"},"key3":["value3a","value3b"]}',
            formattedJson:   '{\n  "key1": {\n    "key2": "value2"\n  },\n  "key3": [\n    "value3a",\n    "value3b"\n  ]\n}'
        }
    },
    tearDown: function(){
        delete this.data;
    }
});


/**
 * URL encode/decode test cases
 */
YAHOO.strconv.Test.add(new YAHOO.tool.TestCase({
    name: "URL Encoding Test",
    
    setUp: function(){
        var self          = this;
        this.Assert       = YAHOO.util.Assert;
        this.converted    = "";
        this.data         = YAHOO.strconv.Test.data;
        this.callbackFunc = function(converted){
            self.converted = converted;
        };
    },
    
    tearDown: function(){
        delete this.Assert;
        delete this.data;
        delete this.converted;
        delete this.callbackFunc;
    },
    
    testUrlEncodeUtf8: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.originalText, "encode", "utf-8");
        
        this.Assert.areEqual(this.data.urlEncodedUtf8.toLowerCase(), converted.toLowerCase());
    },
    
    testUrlDecodeUtf8: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.urlEncodedUtf8, "decode", "utf-8");
        
        this.Assert.areEqual(this.data.originalText, converted);
    },
    
    testUrlEncodeSjis: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.originalText, "encode", "shift_jis", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.urlEncodedSjis.toLowerCase(), this.converted.toLowerCase());            
        }, 5000);
    },
    
    testUrlDecodeSjis: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.urlEncodedSjis, "decode", "shift_jis", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.originalText, this.converted);            
        }, 5000);        
    },
    
    testUrlEncodeEuc: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.originalText, "encode", "euc-jp", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.urlEncodedEuc.toLowerCase(), this.converted.toLowerCase());            
        }, 5000);
    },
    
    testUrlDecodeEuc: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.urlEncodedEuc, "decode", "euc-jp", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.originalText, this.converted);            
        }, 5000);        
    },
    
    testUrlEncodeJis: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.originalText, "encode", "iso-2022-jp", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.urlEncodedJis.toLowerCase(), this.converted.toLowerCase());            
        }, 5000);
    },
    
    testUrlDecodeJis: function(){
        var converted = YAHOO.strconv.UrlEncode.convert(this.data.urlEncodedJis, "decode", "iso-2022-jp", this.callbackFunc);
        
        this.wait(function(){
            this.Assert.areEqual(this.data.originalText, this.converted);            
        }, 5000);        
    }
}));


/**
 * Unicode escape/unescape test cases
 */
YAHOO.strconv.Test.add(new YAHOO.tool.TestCase({
    name: "Unicode Escape Test",
    
    setUp: function(){
        this.Assert = YAHOO.util.Assert;
        this.data   = YAHOO.strconv.Test.data;
    },
    
    tearDown: function(){
        delete this.Assert;
        delete this.data;
    },
    
    testUnicodeEscape: function(){
        var converted = YAHOO.strconv.UnicodeEscape.convert(this.data.originalText, "escape");
        
        this.Assert.areEqual(this.data.unicodeEscaped.toLowerCase(), converted.toLowerCase());
    },
    
    testUnicodeUnescape: function(){
        var converted = YAHOO.strconv.UnicodeEscape.convert(this.data.unicodeEscaped, "unescape");
        
        this.Assert.areEqual(this.data.originalText, converted);
    }
}));


/**
 * UI test cases
 */
YAHOO.strconv.Test.add(new YAHOO.tool.TestCase({
    name: "UI Test",
    
    setUp: function(){
        this.Assert = YAHOO.util.Assert;
        this.data   = YAHOO.strconv.Test.data;
        this.textareaInput  = document.getElementById("input-str");
        this.textareaResult = document.getElementById("converted-str");
        this.inputIndent    = document.getElementById("indent-num");
        
        YAHOO.util.UserAction.click(document.getElementById("url-encoding"));
        YAHOO.util.UserAction.click(document.getElementById("label-utf-8"));
        YAHOO.util.UserAction.click(document.getElementById("label-url-encode"));
        
        this.textareaInput.value  = "";
        this.textareaResult.value = "";
    },
    
    tearDown: function(){
        this.textareaInput.value  = "";
        this.textareaResult.value = "";
        this.inputIndent.value    = "4";
        
        YAHOO.util.UserAction.click(document.getElementById("url-encoding"));
        YAHOO.util.UserAction.click(document.getElementById("label-utf-8"));
        YAHOO.util.UserAction.click(document.getElementById("label-url-encode"));
        
        delete this.Assert;
        delete this.data;
        delete this.textareaInput;
        delete this.textareaResult;
        delete this.inputIndent;
    },
    
    testUrlEncodeUtf8UI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalText;
        YAHOO.util.UserAction.keyup(this.textareaInput, {shiftKey: true});
        
        var converted = this.textareaResult.value;
        
        this.Assert.areEqual(this.data.urlEncodedUtf8.toLowerCase(), converted.toLowerCase());
    },
    
    testUrlDecodeUtf8UI: function(){
        
        this.textareaInput.focus();
        this.textareaInput.value = this.data.urlEncodedUtf8;

        // You can not use UserAction.click to change YUI Button if you generate YUI Button
        // from HTML markup. (I don't know in case of generatin by JavaScript.)
        // You need to prepare label element to click button
        //
        // YAHOO.util.UserAction.click(document.getElementById("url-decode")); // this doesn't work
        // YAHOO.util.UserAction.click(document.getElementById("url-decode").firstChild); // this doesn't work either
        // YAHOO.util.UserAction.click(document.getElementById("url-decode-button")); // this doesn't work
        // YAHOO.util.UserAction.click(document.getElementById("url-decode-button").firstChild); // this doesn't work
        YAHOO.util.UserAction.click(document.getElementById("label-url-decode")); // this works!
        
        var converted = this.textareaResult.value;
        
        this.Assert.areEqual(this.data.originalText, converted);
    },
    
    testUrlEncodeSjisUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalText;
        YAHOO.util.UserAction.click(document.getElementById("label-url-encode"));
        YAHOO.util.UserAction.click(document.getElementById("label-shift_jis"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.urlEncodedSjis.toLowerCase(), converted.toLowerCase());
        }, 5000);
    },
    
    testUrlDecodeSjisUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.urlEncodedSjis;
        YAHOO.util.UserAction.click(document.getElementById("label-url-decode"));
        YAHOO.util.UserAction.click(document.getElementById("label-shift_jis"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.originalText, converted);
        }, 5000);
    },
    
    testUrlEncodeEucUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalText;
        YAHOO.util.UserAction.click(document.getElementById("label-url-encode"));
        YAHOO.util.UserAction.click(document.getElementById("label-euc-jp"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.urlEncodedEuc.toLowerCase(), converted.toLowerCase());
        }, 5000);
    },
    
    testUrlDecodeEucUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.urlEncodedEuc;
        YAHOO.util.UserAction.click(document.getElementById("label-url-decode"));
        YAHOO.util.UserAction.click(document.getElementById("label-euc-jp"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.originalText, converted);
        }, 5000);
    },
    
    testUrlEncodeJisUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalText;
        YAHOO.util.UserAction.click(document.getElementById("label-url-encode"));
        YAHOO.util.UserAction.click(document.getElementById("label-iso-2022-jp"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.urlEncodedJis.toLowerCase(), converted.toLowerCase());
        }, 5000);
    },
    
    testUrlDecodeJisUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.urlEncodedJis;
        YAHOO.util.UserAction.click(document.getElementById("label-url-decode"));
        YAHOO.util.UserAction.click(document.getElementById("label-iso-2022-jp"));
        
        this.wait(function(){
            var converted = this.textareaResult.value;
            this.Assert.areEqual(this.data.originalText, converted);
        }, 5000);
    },
    
    testUnicodeEscapeUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalText;
        YAHOO.util.UserAction.click(document.getElementById("unicode-escaping"));
        YAHOO.util.UserAction.click(document.getElementById("label-unicode-escape"));
        
        var converted = this.textareaResult.value;
        this.Assert.areEqual(this.data.unicodeEscaped.toLowerCase(), converted);
    },
    
    testUnicodeUnescapeUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.unicodeEscaped;
        YAHOO.util.UserAction.click(document.getElementById("unicode-escaping"));
        YAHOO.util.UserAction.click(document.getElementById("label-unicode-unescape"));
        
        var converted = this.textareaResult.value;
        this.Assert.areEqual(this.data.originalText, converted);
    },
    
    testFormatJsonUI: function(){
        this.textareaInput.focus();
        this.textareaInput.value = this.data.originalJsonStr;
        YAHOO.util.UserAction.click(document.getElementById("json-formatter"));
        
        this.inputIndent.focus();
        this.inputIndent.value = "2";
        YAHOO.util.UserAction.keyup(this.inputIndent, {shiftKey: true});
        
        var converted = this.textareaResult.value;
        this.Assert.areEqual(this.data.formattedJson, converted);
    }
}));


/**
 * Run test suite when "Run Test Suite" link is clicked
 */
YAHOO.util.Event.addListener("run-test", "click", function(){
    document.getElementById("ft").innerHTML = "";
    
    var logger = new YAHOO.tool.TestLogger(null, {left:"0px", bottom:"0px"});
    YAHOO.tool.TestRunner.add(YAHOO.strconv.Test);
    YAHOO.tool.TestRunner.run();
});
