// Generated by CoffeeScript 1.9.3
(function() {
  var create_property_string, globalRef, jsonCss, non_pixel_props, vendors;

  globalRef = typeof window !== "undefined" && window !== null ? window : global;

  if ((typeof module !== "undefined" && module !== null) && module !== globalRef.module) {
    module.exports = module.exports || {};
    module.exports.__esModule = true;
    jsonCss = module.exports;
  } else if (this === globalRef) {
    this.jsonHtml = jsonCss = {};
  } else {
    jsonCss = this;
  }

  jsonCss.addStyles = function(el_id, rules) {
    var cssStr, styleEl;
    if (typeof window === "undefined" || window === null) {
      return console.error("Trying to create StyleSheet rules on server side!");
    }
    if (arguments.length === 1) {
      rules = el_id;
      el_id = 'main';
    }
    el_id = el_id + '_styles';
    if (typeof rules === 'function') {
      rules = rules();
    }
    cssStr = typeof rules === 'object' ? jsonCss.compile(rules) : rules;
    styleEl = document.getElementById(el_id);
    if (styleEl == null) {
      styleEl = document.createElement('style');
      styleEl.id = el_id;
      document.head.appendChild(styleEl);
    }
    if (el_id === 'main_styles') {
      styleEl.innerHTML += cssStr;
    } else {
      styleEl.innerHTML = cssStr;
    }
  };

  jsonCss.removeStyles = function(el_id) {
    var styleEl;
    if (!el_id) {
      throw Error("Missing id for for styles to be removed");
    }
    styleEl = document.getElementById(el_id + '_styles');
    if (styleEl) {
      return document.head.removeChild(styleEl);
    }
  };

  non_pixel_props = ['font-weight', 'opacity', 'z-index', 'zoom'];

  vendors = function(property_name, val) {
    var i, len, obj, ref, vendor;
    obj = {};
    ref = ['webkit', 'moz', 'ms'];
    for (i = 0, len = ref.length; i < len; i++) {
      vendor = ref[i];
      obj["-" + vendor + "-" + property_name] = val;
    }
    obj[property_name] = val;
    return obj;
  };

  create_property_string = function(key, value) {
    var val;
    key = key.replace(/[A-Z]/g, function(s) {
      return '-' + s.toLowerCase();
    });
    if (typeof value === 'number' && non_pixel_props.indexOf(key) === -1) {
      value = value + "px";
    }
    if (key.match(/ -v$/)) {
      key = key.slice(0, -3);
      return ((function() {
        var ref, results;
        ref = vendors(key, val);
        results = [];
        for (key in ref) {
          val = ref[key];
          results.push("  " + key + ": " + value + ";\n");
        }
        return results;
      })()).join('');
    } else {
      return "  " + key + ": " + value + ";\n";
    }
  };

  jsonCss.compile = function(rulesObj) {
    var childRules, childSelector, children, combineStr, cssStr, declarations, i, j, key, len, len1, nested, newCSS, parentSelector, ref, ref1, selector, value;
    if (jsonCss.stack == null) {
      jsonCss.stack = [];
    }
    if (jsonCss.stack.indexOf(rulesObj) !== -1 || jsonCss.stack.length === 100) {
      console.warn('jsonCss.stack', jsonCss.stack);
      throw "Endless stack in jsonCss.compile!";
    }
    jsonCss.stack.push(rulesObj);
    cssStr = '';
    for (selector in rulesObj) {
      childRules = rulesObj[selector];
      declarations = '';
      nested = {};
      for (key in childRules) {
        value = childRules[key];
        if (typeof value === 'object') {
          children = [];
          ref = key.split(/\s*,\s*/);
          for (i = 0, len = ref.length; i < len; i++) {
            childSelector = ref[i];
            ref1 = selector.split(/\s*,\s*/);
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              parentSelector = ref1[j];
              combineStr = (function() {
                switch (childSelector.slice(0, 1)) {
                  case ':':
                    return '';
                  case '&':
                    childSelector = childSelector.slice(1);
                    return '';
                  default:
                    return ' ';
                }
              })();
              children.push(parentSelector + combineStr + childSelector);
            }
          }
          nested[children.join(',')] = value;
        } else {
          declarations += create_property_string(key, value);
        }
      }
      if (declarations.length) {
        newCSS = selector + " {\n" + declarations + "}\n";
        cssStr += newCSS;
      }
      cssStr += jsonCss.compile(nested);
    }
    jsonCss.stack.pop();
    return cssStr;
  };

}).call(this);
