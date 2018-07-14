"use strict"

//  星云链保存文章名称、内容hash、文章作者账户

//  数据库中保存的js对象ArticleItem
var ArticleItem = function(text) {
	if(text) {
		// 解析json
		var obj=JSON.parse(text);
		this.title = obj.title;
		this.contenthash = obj.contenthash;
		this.account = obj.account;
	}else {
		this.title ="空空如也";
		this.contenthash = "空空如也";
		this.account = "空空如也";
	}
};

// 给ArticleItem对象添加toString方法,把json对象 序列化为字符串，才能上链存储
ArticleItem.prototype ={
	toString :function() {
		return JSON.stringify(this);
	}
};

// 将文章使用map的方式上链保存,map的名字为ArticleMap
var Article = function (){
	LocalContractStorage.defineMapProperty(this,"ArticleMap",{
		parse: function (text) {
            return new ArticleItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
        
    });
    LocalContractStorage.defineProperty(this, "g_length",null);
}


Article.prototype ={
	init: function(){
		this.g_length=0;
	},
	//提交文章的接口 参数为键值对map，key为文章标题，value为内容哈希值
	submit: function(key,value){
		//调用该接口的人为该文章所属的星云账户
		var from= Blockchain.transaction.from;
		var articleItem = new ArticleItem();
		articleItem.title=key;
		articleItem.contenthash=value;
		articleItem.account=from;
		this.ArticleMap.put(this.g_length,articleItem);
		this.g_length=this.g_length+1;
		return this.ArticleMap.get(this.g_length-1);
	},
	//获取文章列表
	getArticle:function(){
		var result=[];
		for (var i = 0; i < this.g_length; i++) {
			result[i]=this.ArticleMap.get(i);
		}
		return result;
	}

};
module.exports = Article;

