// miniprogram/pages/comment/comment.js

wx.cloud.init();

const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', // 评价 的内容
    score: 0, // 评分
    images: [], // 要上传的图片列表
    fileIds: [], // 
    movieid: -1,
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
        });
        console.log(this.data.images);
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  submit: function() {
    wx.showLoading({
      title: '评价正在提交',
    })

    console.log(this.data.content);
    console.log(this.data.score);
    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: item
        }).then(res => {
          console.log(res.fileID);
          this.setData({
            fileIds: this.data.fileIds.concat(res.fileID)
          });
          reslove();
        }).catch(err => {
          console.log(err);
        })
      }))
    }

    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('comment').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieid,
          fileIds: this.data.fileIds
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '评论失败：' + err,
        })
      }) 
    })

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
    this.setData({
      movieid: options
    });
    this.getDetail(options);
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