;(function ($) {
    $.extend($.fn, {
        cookie: function (key, value, options) {
            var days, time, result, decode
            // A key and value were given. Set cookie.
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                // Enforce object
                options = $.extend({}, options)

                if (value === null || value === undefined) options.expires = -1

                if (typeof options.expires === 'number') {
                    days = (options.expires * 24 * 60 * 60 * 1000)
                    time = options.expires = new Date()

                    time.setTime(time.getTime() + days)
                }

                value = String(value)

                return (document.cookie = [
                    encodeURIComponent(key), '=',
                    options.raw ? value : encodeURIComponent(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path ? '; path=' + options.path : '/',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''))
            }

            // Key and possibly options given, get cookie
            options = value || {}

            decode = options.raw ? function (s) {
                return s
            } : decodeURIComponent

            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
        }

    })
})(Zepto);
/////////////////////////////////////////////////////////

var domain = "http://api-baoxian.lehuanxin.com";

var token = "";
getAccessToken();
function getAccessToken() {
    token = $.fn.cookie('wxToken', {"path": "/"});

    if (token == null) {
        var url = window.location.href;
        var wexinToken = getQueryString("token", url);
        token = wexinToken;
        if (token !== "") {
            $.fn.cookie('wxToken', token, {"path": "/"});
        } else {
            var wexinToken = $.fn.cookie('member_token', {"path": "/"});
            token = wexinToken;
            $.fn.cookie('wxToken', wexinToken, {"path": "/"});
        }
    }


}
function checkMobile(str) {
    var re = /^1\d{10}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
function tooltip(msg, time) {
    var len = msg.length;
    var width = len * 20;
    var str = '<div class="js_dialog" >' +
        // '<div class="weui-mask"></div>'+
        '<div class="weui-dialog" style="background:#000000;max-width:' + width + 'px;">' +
        ' <div class="weui-dialog__bd" style="min-height:0px;color:#fff;padding:10px 5px 10px 5px;">' + msg + '</div>' +
        // '<div class="weui-dialog__ft">'+
        //    ' <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>'+
        // '</div>'+
        '</div>' +
        '</div>';
    $("body").append(str);

    var obj = $(str);
    obj.fadeIn(200);
    if (typeof time != "undefined") {
        setTimeout(function () {
            $(".js_dialog").remove()
        }, time);
    }
}
function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
        return false;
    } else {
        return true;
    }
}
function tooltipSuccess(msg, id) {
    var str = '<div class="js_dialog" >' +
        '<div class="weui-mask"></div>' +
        ' <div class="weui-dialog">' +
        ' <div class="weui-dialog__bd">' + msg + '</div>' +
        '<div class="weui-dialog__ft">';
    if (typeof id == "undefined") {
        str += '<a href="javascript:closeDialog();" style="color:#2194FE;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>';
    } else {
        str += '<a href="orderDetail.html?id=' + id + '" style="color:#2194FE;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>';
    }

    str += '</div>' +
        '</div>' +
        '</div>';
    closeDialog();
    $("body").append(str);

    var obj = $(str);
    obj.fadeIn(200);
}

function closeDialog() {
    var dialog = $(".js_dialog");
    if (dialog.length > 0) {
        dialog.remove();
    }
}
// 获取URL地址参数
function getQueryString(name, url) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (!url || url == "") {
        url = window.location.search;
    } else {
        url = url.substring(url.indexOf("?"));
    }
    r = url.substr(1).match(reg)
    if (r != null) return unescape(r[2]);
    return null;
}
function getOrderStatusString(status) {
    status = parseInt(status);
    var str = "";
    switch (status) {
        case 0:
            str = "已取消";
            break;
        case 10:
            str = "未付款";
            break;
        case 20:
            str = "已付款";
            break;
        case 30:
            str = "保障中";
            break;
        case 40:
            str = "已完成";
            break;
        case 60:
            str = "申请退款";
            break;
        case 70:
            str = "退款成功";
            break;
        case 80:
            str = "退保";
            break;
        case 90:
            str = "已过保";
            break;
        case 21:
            str = "待审核";
            break;
        case 22:
            str = "审核成功";
            break;
        case 23:
            str = "审核失败";
            break;
        default:
            str = "未付款";
    }
    return str;
}
function getStateString(state) {
    state = parseInt(state);
    var str = "";
    switch (state) {
        case 0:
            str = "审核失败";
            break;
        case 1:
            str = "提交理赔";
            break;
        case 2:
            str = "审核成功";
            break;
        case 3:
            str = "服务中";
            break;
        case 4:
            str = "服务中";
            break;
        case 5:
            str = "维保完成";
            break;
        case 7:
            str = "理赔失败";
            break;
        default:
            str = "失败";
    }
    return str;
}
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
function loadingToast() {
    var str = '<div id="loadingToast">' +
        '<div class="weui-mask_transparent" style="background:rgba(0,0,0,0.3);"></div>' +
        '<div class="weui-toast">' +
        '<i class="weui-loading weui-icon_toast"></i>' +
        '<p class="weui-toast__content"></p>' +
        '</div></div>';
    closeDialog();
    $("body").append(str);

    var obj = $(str);
    obj.fadeIn(100);
}
function closeLoading() {
    $("#loadingToast").remove();
}
function protocolDialog() {
    var msg = "<div style='font-size:16px;font-weight:bolder;text-align:center;'>手机碎屏维修服务协议</div>" +
        "<div style='font-size:14px;font-weight:bolder;'>一、产品介绍：</div>" +
        "1、此服务是由四川欢欣网络科技有限公司与中国人寿财险股份有限公司共同开发的，对手机屏幕提供的碎屏维修更换服务。<br>" +
        "2、碎屏维修服务是针对手机屏幕碎裂提供的更换新屏幕的服务。<br>" +
        "3、购买条件：30天之内的具有入网许可证的全新手机。<br>" +
        "4、生效时间：资料提交审核通过后第8天0点生效。<br>" +
        "5、服务时间：12个月，生效当天起算。<br>" +
        "6、购买流程：通过关注“乐换新”微信公众号，选择意外保障-卡券激活-完善资料-上传照片，完成资料上传，资料一定真实，审核通过后第8天0点生效，生效后享受12个月的碎屏维修服务。<br>" +
        "<div style='font-size:14px;font-weight:bolder;'>二、服务说明</div>" +
        "1、在服务有效期内，服务保障的手机在正常使用中因意外事件直接导致手机的显示屏整体或者部分破裂，用户将获得免费的显示屏维修更换服务。<br>" +
        "2、本服务有效期的起止时间以服务生效时间算起，服务有效期为一年。服务生效前及服务终止后发生的损坏不在本服务计划负责的范围内。<br>" +
        "3、在服务有效期内，显示屏维修更换次数最多为一次，当维修结束后本次服务合同自动终止。<br>" +
        "4、本服务的维修金额如超出手机投保的最高维修金额，超出部分需用户自行支付。<br>" +
        "<div style='font-size:14px;font-weight:bolder;'>三、理赔：</div>" +
        "1、理赔条件（须同时满足以下4个条件）<br />"+
        "（1）手机屏幕具有明显碎裂痕迹；"+
        "（2）手机未更换过屏幕或拆机维修过其他零部件；"+
        "（3）手机机身IMEI串号与本公司系统投保时填写记录的手机机身IMEI串号一致；"+
        "（4）手机型号与投保时系统记录投保手机型号一致。"+
        "2、理赔方式<br>" +
        "（1）、通过线上入口申请理赔，上传碎屏带串号正面照片（开机状态下输入*#06#显示数字后的整机照片）、背面照片、用户身份证正面照片及背面照片，照片清晰可见。<br>" +
        "（2）如果用户存在疑问，请拨打全国服务热线4000900299进行咨询。" +
        "3、资料审核：<br>" +
        "（1）、用户理赔后，由客服人员进行材料审核，审核时间为12小时（工作时间内，工作时间为9：00-18：00*7天），审核通过后，以电话形式告知用户审核结果，审核通过用户即可到指定维修点进行维修，审核不通过不予以维修，不予以维修手机由乐换新给出合理的解释。<br>" +
        "（2）、维修完成后当天通过顺丰快递寄出，顺丰快递不能到达的区域，通过其他快递寄出。<br>" +
        "4、维修方法：用户将手机邮寄到指定的维修点进行维修。<br>" +
        "5、邮寄费用：需要邮寄所产生的快递费用由谁寄出则由谁承担（乐换新使用顺丰快递进行邮寄，顺丰快递不能到达的区域，使用其他快递邮寄）不支持到付<br>" +
        "6、维修时间：维修时间为收到碎屏手机后三个工作日之内维修完成，缺少配件导致维修时间延长属于正常情况，维修完毕后当天寄出。<br>" +
        "7、用户收到维修成功的手机后需立即确认功能是否完好，7日内可返修，超过7天则视为维修成功。"+
        "8、维修条件：<br>" +
        "（1）、手机屏幕碎裂后能够正常显示，可到指定合作维修点进行维修；<br>" +
        "（2）、手机屏幕碎裂后不能正常显示，必须将手机邮寄到乐换新总部进行检测维修，且必须保证手机机身码与手机码一致，检测通过后给予维修，维修完成后将手机寄回。检测不通过的不予以维修，并给出不维修理由，并将旧手机寄回。<br>" +
        "9、不保修范围：<br>" +
        "1）、恶意人为，恶意的人为敲击、打砸等导致屏幕碎裂的，不予以理赔维修；<br>" +
        "2）、损坏严重，无法判定理赔手机为投保手机，将不予以理赔维修；<br>" +
        "3）、手机使用不当（包括不符合运行环境要求而导致的损坏），用户故意损坏或纵容设备被损坏，以及其他不属于意外损坏的情况；<br>" +
        "4）、故障异常包含碎屏手机内、外屏损坏状态/故障（含位置异常、损坏程度）不匹配，或碎屏手机屏幕不是激活时的屏幕（如激活保修后私自换屏，屏幕编码不对应），将不予以理赔维修；<br>" +
        "5）、手机的产品序列号或IMEI标签缺失、损坏、涂改、字迹模糊，或手机上的产品序列号或IMEI信息与设备操作系统内的信息不一致；<br>" +
        "6）、用户私自拆机的，不予以理赔维修；<br>" +
        "7）、投保手机在购买投保碎屏险前已发生过维修或者拆机行为，不予以维修"+
        "8）、手机屏幕已经碎裂进行后补购买的，不予以理赔维修；<br>" +
        "9）、用户申请维修时所提供的设备信息和用户身份识别信息与本公司数据系统所载投保信息不一致，不予以理赔维修；<br>" +
        "10）、无法确定激活日期或出厂日期的设备、山寨机、翻新机；<br>" +
        "11）、出厂时未经检验的设备或经检验属于不合格的设备；<br>" +
        "12）、因不可抗力（地震、海啸、洪水，战争、敌对行动、军事行为、武装冲突、罢工、骚乱、暴动恐怖活动、核反应、核辐射、放射性污染等）造成的损坏；<br>" +
        "13）、本服务计划生效前或终止后发生的任何损失。<br>" +
        "10、维修说明：<br>" +
        "（1）、乐换新采用更换屏幕总成（包含原装液晶显示屏幕+后压保护玻璃）。<br>" +
        "（2）、维修完成后，更换下来的旧屏幕由乐换新代保险公司回收处理，碎屏（外屏+总成）所有权归乐换新所有。<br>" +
        "（3）、维修完成后，由维修点提供90天的屏幕质保，人为原因导致屏幕质量问题的不在质保范围之内。"+
        "11、客服回访，维修完成之后，三天之内，客服人员将对用户进行电话回访，内容包含维修时间，维修人员态度，等待时间，使用情况等。<br>" +
        "<div style='font-size:14px;font-weight:bolder;'>四、服务的续期、转让、撤销及终止</div>" +
        "1、本服务购买后不可以任何形式转让、抵押。<br>" +
        "2、您一旦支付完购买本服务的款项，并且服务生效以后，则该款项将不可退还，您也无权自行撤销或终止本服务。<br>" +
        "3、有下列情形之一的，本服务计划将自然终止：<br>" +
        "（1）已达到本服务计划约定的期满日；<br>" +
        "（2）已获得1次显示屏意外损坏维修更换服务；<br>" +
        "（3）用户通过任何欺诈、虚假陈述或隐瞒获取本服务计划下的任何利益;<br>" +
        "（4）手机经由本公司指定维修商或同品牌厂家授权以外的人或公司进行了维修或更换。<br>" +
        "（5）申请维修中手机存在不在维修范围之内问题发生如（机身零部件不完善、私自拆机、更换屏幕等）造成拒绝维修理赔的。<br />"+
        "4、用户在平台投保激活则认可本协议条款内容、文本协议和网页端、微信公众号平台电子协议具有同等法律效益。<br>" +
        "<b>注：本条款的相关事宜最终解释权归四川欢欣网络科技有限公司所有</b>";
    var h = parseInt($(window).height() / 1.5);
    var str = '<div class="js_dialog" >' +
        '<div class="weui-mask"></div>' +
        ' <div class="weui-dialog">' +
        ' <div class="weui-dialog__bd" style="max-height:' + h + 'px;text-align:left;overflow-y:auto;">' + msg + '</div>' +
        '<div class="weui-dialog__ft">';

    str += '<a href="javascript:closeDialog();" style="color:#2194FE;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>';


    str += '</div>' +
        '</div>' +
        '</div>';
    closeDialog();
    $("body").append(str);

    var obj = $(str);
    obj.fadeIn(200);
}
function confirmDialog(id) {
    var str = '<div class="js_dialog" id="iosDialog1">' +
        '<div class="weui-mask"></div>' +
        '<div class="weui-dialog">' +
        '<div class="weui-dialog__hd"><strong class="weui-dialog__title">弹窗标题</strong></div>' +
        '<div class="weui-dialog__bd">ninque</div>' +
        '<div class="weui-dialog__ft">' +
        '<a href="javascript:confirmOk(' + id + ');" class="weui-dialog__btn weui-dialog__btn_default">确定</a>' +
        '<a href="javascript:closeDialog();" class="weui-dialog__btn weui-dialog__btn_primary">取消</a>' +
        '</div>' +
        '</div>' +
        '</div>';

}
function confirmOk(id) {
    $.ajax({
        type: 'post',
        url: domain + "/account/cancel",
        data: {"order_id": id, "token": token},
        success: function (data) {
            //tooltip(data.message,3000);
            //closeLoading();
            if (data.code == 200) {

                tooltipSuccess("订单已取消");
            } else {
                tooltip(data.message, 3000);
            }

        }
    });
}
function uploadImage(id) {

    var uploader = WebUploader.create({
        pick: {
            id: '#' + id + "Wrap",
            multiple: false
        },
        method: 'POST',
        fileVal: 'upfile',
        server: domain + '/default/binaryfile',
        auto: true,
        sendAsBinary: true,
        swf: './js/Uploader.swf',
        fileSingleSizeLimit: 10 * 1024 * 1024,    // 10 M
        compress: {
            width: 960,
            height: 1280,
            quality: 100,
            allowMagnify: false,
            crop: false,
            preserveHeaders: true,
            compressSize: 1 * 1024 * 1024 //小于1 M 不压缩
        },
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    uploader.on('uploadStart', function (file) {
        loadingToast("图片上传中...");
    });
    uploader.on('uploadError', function (file, reason) {
        tooltip("失败原因：" + reason, 3000);

    });

    uploader.on('fileQueued', function (file) {
        var list = $('#' + id + "Img");
        uploader.makeThumb(file, function (error, src) {
            closeLoading();
            if (error) {
                tooltip("上传失败", 3000);
            } else {
                $("#" + id + "Wrap").addClass("opacity");
                list.html('<img style="width:100%;height:100%;"  src="' + src + '" />');

            }
        })

    });

    uploader.on("uploadComplete", function (file) {
        closeLoading();
    });

    uploader.on('uploadSuccess', function (file, response) {
        closeLoading();
        tooltip(response.message, 3000);
        if (response.code == 200) {
            $("#" + id + "Path").val(response.data.path);
        } else {
            tooltip(data.message, 3000);
        }


    });
}