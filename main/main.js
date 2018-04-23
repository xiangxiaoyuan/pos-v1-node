'use strict'
var loadAllItems = require('../main/datbase.js').func_a;
var loadPromotions = require('../main/datbase.js').func_b;


function shoppingId(id) {
    var count = 1;
    var shoppingId = [];
    for(var i = 0;i<id.length;i++){
        for(var j = i+1;j<id.length;j++){
            if(id[i] == id[j]) {
                count++;
                id.splice(j, 1);
                j--;
            }
        }
        shoppingId.push({"barcode":id[i],"count":count});
        count = 1;
    }
    return shoppingId;
}


function resultId(id) {
    var resultId = [];
    for(var i = 0;i<id.length;i++){
        if(id[i].barcode.length>10){
            var cutId = id[i].barcode.split("-");
            resultId.push({"barcode":cutId[0],"count":parseInt(cutId[1])});
        }
        else {
            resultId.push(id[i]);
        }
    }
    return resultId;
}


function printShoppingList(id) {
    var shoppingList = []
    for(var i = 0;i<id.length;i++){
        for(var j = 0;j<loadAllItems().length;j++){
            if(id[i].barcode == loadAllItems()[j].barcode){
                shoppingList.push({"barcode":id[i].barcode,"count":id[i].count,"name":loadAllItems()[j].name,
                "unit":loadAllItems()[j].unit,"price":loadAllItems()[j].price});
            }
        }
    }
    return shoppingList;
}


function shoppingDiscount(discountList) {
    var allCount = 0;
    var freeNum = 0;
    for(var i = 0;i<discountList.length;i++){
        if(discountList[i].count>2) {
            for (var j = 0; j < loadPromotions()[0].barcodes.length; j++) {
                if (discountList[i].barcode == loadPromotions()[0].barcodes[j]) {
                    freeNum = Math.floor(discountList[i].count / 3);
                    allCount = discountList[i].price * (discountList[i].count - freeNum);
                    discountList[i].free = freeNum;
                    discountList[i].resultCount = allCount;
                }
            }
        }
        else {
            allCount = discountList[i].price*discountList[i].count;
            discountList[i].resultCount = allCount;
        }
    }
    return discountList;
}

function printInventory(selectedItem){
    var noRepeatId = shoppingId(selectedItem);
    var id = resultId(noRepeatId);
    var shoppingList = printShoppingList(id);
    var discountList = shoppingDiscount(shoppingList);
    var outputList = '';
    var outputPrice = 0;
    var outputDiscount = '';
    var discountPrice = 0;
    for(var i = 0;i<discountList.length;i++){
        var list = '名称：'+discountList[i].name+'，数量：'+discountList[i].count+discountList[i].unit+
            '，单价：'+ discountList[i].price.toFixed(2)+'(元)，小计：'+
            discountList[i].resultCount.toFixed(2)+'(元)\n';
        outputList += list;
    }
    for(var i = 0;i<discountList.length;i++){
        if(discountList[i].hasOwnProperty("free")){
            var list = '名称：'+discountList[i].name+'，数量：'+
                discountList[i].free+discountList[i].unit+'\n';
            outputDiscount += list;
            discountPrice += parseInt(discountList[i].free)*discountList[i].price;
        }
    }
    for(var i = 0;i<discountList.length;i++){
        outputPrice += discountList[i].resultCount;
    }
    return '***<没钱赚商店>购物清单***\n' + outputList+
        '----------------------\n' +
        '挥泪赠送商品：\n' +outputDiscount+
        '----------------------\n' +
        '总计：'+outputPrice.toFixed(2)+'(元)\n' +
        '节省：'+discountPrice.toFixed(2)+'(元)\n' +
        '**********************';;
}
module.exports = function main(selectedItem) {
    var output = printInventory(selectedItem);
    console.log(output);
    return output;
};
