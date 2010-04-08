(function(){
  $(function() {
    var cssTransitionsSupported, flip, form, formInputFields, showEnvelope, submitButton, submitButtonInner, success;
    // A -webkit-transition only version of:
    // http://technology.razorfish.com/2010/02/08/detecting-css-transitions-support-using-javascript/
    cssTransitionsSupported = false;
    (function() {
      var div;
      div = document.createElement('div');
      div.innerHTML = '<div style="-webkit-transition:color 1s linear;"></div>';
      cssTransitionsSupported = div.firstChild.style.webkitTransition;
      return delete div;
    })();
    form = $("#order-form");
    submitButton = form.find("button");
    submitButtonInner = submitButton.find("strong");
    formInputFields = form.find(":input");
    success = $("#order-form-success");
    $("#sponsors-message").mouseover(function() {
      $(this).fadeOut(6000);
      return null;
    });
    $("a.order-now").click(function() {
      form.show();
      setTimeout((function() {
        return form.addClass("visible").find("input:first").focus();
      }), 50);
      return false;
    });
    form.bind("change keydown", function() {
      var __a, __b, __c, __d, __e, disabled, f, field, formValues, missingFields;
      formValues = {
      };
      __a = form.find("form").serializeArray();
      for (__b = 0; __b < __a.length; __b++) {
        f = __a[__b];
        ((formValues[f.name] = f.value));
      }
      missingFields = (function() {
        __c = []; __d = ["attendee", "name", "sex", "size"];
        for (__e = 0; __e < __d.length; __e++) {
          field = __d[__e];
          if (!(formValues[field] == undefined ? undefined : formValues[field].length)) {
            __c.push(field);
          }
        }
        return __c;
      }).call(this);
      disabled = missingFields.length ? "disabled" : null;
      return submitButton.attr("disabled", disabled);
    });
    form.submit(function() {
      if (submitButton.attr("disabled")) {
        return false;
      }
      form.data("original-button-text", submitButtonInner.text());
      submitButtonInner.text("Reserving...");
      $.ajax({
        url: "http://railscampteev5.toolmantim.com/order",
        type: "POST",
        data: form.find("form").serialize(),
        success: function success() {
          return flip();
        },
        error: function error(xhr, status) {
          var arguments = Array.prototype.slice.call(arguments, 0);
          return console.log.apply(console, arguments);
        }
      });
      formInputFields.attr("disabled", "disabled");
      return false;
    });
    flip = function flip() {
      form.addClass("flipped");
      if (!(cssTransitionsSupported)) {
        return showEnvelope();
      }
    };
    form.get(0).addEventListener("webkitTransitionEnd", (function(event) {
      if (event.propertyName === "-webkit-transform") {
        return showEnvelope();
      }
    }), false);
    showEnvelope = function showEnvelope() {
      form.hide().removeClass("visible").removeClass("flipped");
      formInputFields.attr("disabled", null).attr("checked", null).attr("selected", null).val(null);
      submitButtonInner.text(form.data("original-button-text"));
      success.css({
        height: $("#order-form").height()
      }).show();
      return setTimeout((function() {
        return success.addClass("unflipped");
      }), 50);
    };
    return success.click(function() {
      success.addClass("zoomed-away");
      return setTimeout((function() {
        return success.hide().removeClass("unflipped").removeClass("zoomed-away");
      }), 1000);
    });
  });
})();