// miniprogram/pages/comment/comment.js

wx.cloud.init();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', // 评价 的内容
    score: 0, // 评分
    images: [], // 要上传的图片列表
  },

  uploadImg: function() {
    // 首先选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const imgPath = res.tempFilePaths;
        this.setData({
          images: this.data.images.concat(imgPath)
        });;
        console.log(this.data.images);
        // wx.cloud.uploadFile({
        //   cloudPath: "",
        //   filePath: imgPath
        // }).then(res => {
        //   console.log(res);
        // }).catch(err => {
        //   console.log(err);
        // })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  submit: function() {
    console.log(this.data.content);
    console.log(this.data.score);
  },

  onContentChange: function(event) {
    this.setData({
      content: event.detail
    });
  },

  onScoreChange: function(score) {
    this.setData({
      score: score.detail
    });
  },

  getDetail: function(options) {
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      this.setData({
        detail: JSON.parse(res.result)
      });
      console.log(JSON.parse(res.result))
    }).catch(err => {
      console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail({ movieid: 3097572})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})