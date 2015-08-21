window.onbeforeunload = function ()
{
    $.AMUI.utils.cookie.set('ukey', null);
    $.AMUI.utils.cookie.set('uid', null);
    $.AMUI.utils.cookie.set('pwd', null);
};
$.ajaxSetup({
  cache: true,
  statusCode: {
      406: function () {
          $("#msg").html("Error 406 请求速度过快！");
          $('#my-prompt').modal('open');
      },
      412: function () {
          $("#msg").html("Error 412 用户名或密码错误！");
          $('#my-prompt').modal('open');
      },
      404: function () {
          $("#msg").html("Error 404 系统没有对应服务接口！");
          $('#my-prompt').modal('open');
      },
      417: function () {
          $("#msg").html("Error 417 系统没有对应谓词接口！");
          $('#my-prompt').modal('open');
      }
  }
});

function mainViewModel() {
  var self = this;
  self.showuser = ko.observable(false);
  self.shownav = ko.observable(false);
  self.showuinfo = ko.observable(false);
  self.showback = ko.observable(false);
  self.uid = ko.observable("");
  self.pwd = ko.observable("");
  self.link_acuss = function () {
      go("web/ac_uss_page.html");
  };
  self.link_acaddus = function () {
      go("web/ac_addus_page.html");
  };
  self.link_account = function () {
      go("web/ac_page.html");
  };
  self.link_user_center = goCenter;

  self.rembme = ko.observable(false);
  if (typeof (Storage) !== "undefined") {
      if (localStorage.getItem("uid") !== null) {
          self.rembme(true);
          self.uid(localStorage.getItem("uid"));
          self.pwd(localStorage.getItem("pwd"));
      }
  }
  self.rembme.subscribe(function (val) {
      if (typeof (Storage) !== "undefined") {
          if (val) {
              if (self.uid() !== "" && self.pwd() !== "") {
                  localStorage.setItem('uid', self.uid());
                  localStorage.setItem('pwd', self.pwd());
                  $("#msg").html("账号已记录在本机！");
                  $('#my-prompt').modal('open');
              }
          } else {
              localStorage.clear();
              self.uid("");
              self.pwd("");
          }
      } else {
          $("#msg").html("你的浏览器不支持此功能！");
          $('#my-prompt').modal('open');
      }
  });
  self.link_accountEditPwd = function () {
      go("web/acpwd_page.html");
  };

self.link_user = function () {
    if ($.AMUI.utils.cookie.get('uid') !== null)
    {
        $("#dialog").html("你确定想退出系统吗？");
        var $confirm = $('#exit-confirm');
        var confirm = $confirm.data('am.modal');
            var onConfirm = function () {
            $.AMUI.utils.cookie.set('uid', null);
            $.AMUI.utils.cookie.set('pwd', null);
            window.location = "/";
        };
        var onCancel = function () { };

        if (confirm) {
            confirm.options.onConfirm = onConfirm;
            confirm.options.onCancel = onCancel;
            confirm.toggle(this);
        } else {
            $confirm.modal({
                relatedElement: this,
                onConfirm: onConfirm,
                onCancel: onCancel
            });
        }
    }
};
  self.bt_login = function () {
      if (self.uid() !== "" && self.pwd() !== "") {
          $.AMUI.progress.start();
          $.ajax({
              type:"POST",
              url: "/user/login",
              data:{'username' : self.uid(), 'pwd': self.pwd()}
          }).done(function (data) {
                if (data) {
                    $.AMUI.utils.cookie.set('uid', self.uid(), { expires: 7 });
                    $.AMUI.utils.cookie.set('pwd', self.pwd(), { expires: 7 });
                    $.AMUI.utils.cookie.set('data', data);
                    if (data.username === "admin") {
                       self.showuser(true);
                    }
                    self.shownav(true);
                  //go("web/center_page.html");
                goCenter();
              } else {
                  $("#msg").html("登陆失败");
                  $('#my-prompt').modal('open');
                  self.uid("");
                  self.pwd("");
              }
              $.AMUI.progress.done();
          }).fail(function (xhr) {
              self.uid("");
              self.pwd("");
              $.AMUI.progress.done();
          });
      }
  };

  self.gopage = goCenter;
}
ko.applyBindings(new mainViewModel(), document.getElementById("mainModel")) ;
mainmodel = ko.dataFor(document.getElementById("mainModel"));
function go(url)
{
  $("#render").load(url, null, function (res, status, xhr) {
      if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
      }
      console.log('load success');
  });
  $("#menu1").offCanvas('close');
}
var centerModel, ctvm;
function goCenter() {
    $("#render").load('web/center_page.html', null, function (res, status, xhr) {
        if (status == "error") {
            var msg = "Sorry but there was an error: ";
            $("#error").html(msg + xhr.status + " " + xhr.statusText);
        }
        if (ctvm === undefined) {
            console.log('just once!');
            ctvm = new centerViewModel();
        }
        ko.applyBindings(ctvm, document.getElementById("centerModel"));
        setTimeout(ctvm.loaddata, 200);
    });
    mainmodel.showback(false);
    $("#menu1").offCanvas('close');
}

