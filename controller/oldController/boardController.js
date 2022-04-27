'use strict';

var dayjs = require('dayjs');
const db = require('../config/kyjdb');
var jwtmiddle = require('../middleware/jwt');
var boardDAO = require('../model/boardDAO');
var counterDAO = require('../model/counterDAO')
var logger = require('../config/logger');

//notice
function noticeMain(req, res, next) {
    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    boardDAO.count_noticeBoard(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('board/notice/noticeMain', { db_data, dayjs, permission, parameters, count_data })
                        }
                    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
function noticeWrite(req, res, next) {
    let token = req.session.user;
    var parameters = {
        "name": 'vistors'
    }
    counterDAO.findCount(parameters).then(
        (count_data) => {
            jwtmiddle.jwtCerti(token).then(
                (permission) => {
                    if (permission.userId != undefined) {
                        res.render('board/notice/noticeWrite', { permission, count_data })
                    }
                    else {
                        res.send("<script>alert('Inaccessible');history.back();</script>")
                    }
                }
            ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
        })
}
function noticeDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_noticeBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                res.render('board/notice/noticeDetail', {
                                    dayjs, permission, count_data,
                                    detailData: db_values["detailData"]
                                });
                            }
                        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
            }
        )
        .catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
function noticeModify(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_noticeBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                if (permission.userId == db_values["detailData"][0].userId) {
                                    res.render('board/notice/noticeModify', {
                                        dayjs, permission, count_data,
                                        detailData: db_values["detailData"]
                                    });
                                }
                                else {
                                    res.send("<script>alert('You do not have permission');history.back();</script>");
                                }
                            }
                        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
            }
        )
        .catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
function noticeModifyPost(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
    };
    let token = req.session.user;
    if (req.body.title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (req.body.content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                db.query(`UPDATE Notice_Board SET title=?, content=?,date=? where qid=${parameters.qid}`, [req.body.title, req.body.content, datetime], function (error, results) {
                    if (error) {
                        logger.error(
                            "DB error [Notice_Board]" +
                            "\n \t" + queryData +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else {
                        res.redirect('/board/notice?page=1')
                    }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
    }
}
function noticeWritePost(req, res, next) {
    var content = req.body.content;
    var title = req.body.title;
    let token = req.session.user;

    if (title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                var userId = permission.userId;
                var userName = permission.userName
                var datas = { userId: userId, title: title, content: content, date: datetime, userName: userName };
                db.query('INSERT INTO Notice_Board SET ?', datas, function (error, row) {
                    if (error) {
                        logger.error(
                            "DB error [Notice_Board]" +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else { res.redirect("/board/notice?page=1"); }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
    }
}
function noticeDelete(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    let token = req.session.user;
    jwtmiddle.jwtCerti(token).then(
        (permission) => {
            db.query(`DELETE FROM Notice_Board WHERE qid="${parameters.qid}" && userId="${permission.userId}"`, function (error, row) {
                if (error) {
                    logger.error(
                        "DB error [Notice_Board]" +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                if (row.affectedRows == 0) {
                    res.send("<script>alert('You do not have permission');history.back();</script>");
                }
                else {
                    res.redirect("/board/notice?page=1")
                }
            })
        }
    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
//inquiry
function inquiryMain(req, res, next) {
    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        'name': 'vistors'
    }
    boardDAO.count_questionBoard(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('board/inquiry/inquiryMain', { db_data, dayjs, permission, parameters, count_data })
                        }
                    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
function inquiryWrite(req, res, next) {
    let token = req.session.user;

    var parameters = {
        "name": 'vistors'
    }

    counterDAO.findCount(parameters).then(
        (count_data) => {
            jwtmiddle.jwtCerti(token).then(
                (permission) => {
                    if (permission.userId != undefined) {
                        res.render('board/inquiry/inquiryWrite', { permission, count_data })
                    }
                    else {
                        res.send("<script>alert('Inaccessible');history.back();</script>")
                    }
                }
            ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
        }).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
function inquiryDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_questionBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');history.back();</script>"))
            }
        )
        .then(
            (db_values) => {
                return boardDAO.count_questionBoardComment(parameters)
                    .then((commentData) => { db_values.commentData = commentData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');history.back();</script>"))
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                res.render('board/inquiry/inquiryDetail', {
                                    dayjs, permission,
                                    detailData: db_values["detailData"],
                                    commentData: db_values["commentData"], count_data
                                });
                            }
                        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
            }
        )
        .catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
function inquiryComment(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    var comment = req.body.comment;
    if (comment == "") res.send("<script>alert('댓글을 입력하세요.');history.back();</script>")
    else {
        let token = req.session.user;
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                db.query(`INSERT inquiryComment SET qid=?, comment=?, date=?, userId=?, userName=?`, [parameters.qid, comment, datetime, permission.userId, permission.userName], function (error, results) {
                    if (error) {
                        logger.error(
                            "DB error [inquiryComment]" +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else {
                        res.redirect(`/board/inquiry/inquiryDetail?num=${parameters.qid}`)
                    }
                })
            })
    }
}
function inquiryModify(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_questionBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                if (permission.userId == db_values["detailData"][0].userId) {
                                    res.render('board/inquiry/inquiryModify', {
                                        dayjs, permission, count_data,
                                        detailData: db_values["detailData"]
                                    });
                                }
                                else {
                                    res.send("<script>alert('You do not have permission');history.back();</script>");
                                }
                            }
                        ).catch(err => res.send("<script>alert('jwt err');</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
            }
        )
        .catch(err => res.send("<script>alert('jwt err');</script>"));
}
function inquiryModifyPost(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    let token = req.session.user;
    if (req.body.title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (req.body.content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                db.query(`UPDATE Inquiry_Board SET title=?, content=?,date=? where qid=${parameters.qid}`, [req.body.title, req.body.content, datetime], function (error, results) {
                    if (error) {
                        logger.error(
                            "DB error [Inquiry_Board]" +
                            "\n \t" + queryData +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else {
                        res.redirect('/board/inquiry?page=1')
                    }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');</script>"));
    }
}
function inquiryWritePost(req, res, next) {
    var content = req.body.content;
    var title = req.body.title;
    let token = req.session.user;
    var file = req.file;
    if (title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                var userId = permission.userId;
                var userName = permission.userName;
                if (file != undefined) {
                    var datas = { userId: userId, title: title, content: content, date: datetime, img: file.filename, userName: userName };
                }
                else {
                    var datas = { userId: userId, title: title, content: content, date: datetime, userName: userName };
                }
                db.query('INSERT INTO Inquiry_Board SET ?', datas, function (error, row) {
                    if (error) {
                        logger.error(
                            "DB error [Inquiry_Board]" +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else { res.redirect("/board/inquiry?page=1"); }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
    }
}
function inquiryDelete(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    let token = req.session.user;
    jwtmiddle.jwtCerti(token).then(
        async (permission) => {
            db.query(`DELETE FROM inquiryComment WHERE qid="${parameters.qid}"`)
            db.query(`DELETE FROM Inquiry_Board WHERE qid="${parameters.qid}" && userId="${permission.userId}"`, function (error, row) {
                if (error) {
                    logger.error(
                        "DB error [Inquiry_Board]" +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                if (row.affectedRows == 0) {
                    res.send("<script>alert('You do not have permission');history.back();</script>");
                }
                else {
                    res.redirect("/board/inquiry?page=1")
                }
            })
        }
    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}

//free
function freeBoardMain(req, res, next) {
    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    boardDAO.count_freeBoard(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('board/free/FreeBoardMain', { db_data, dayjs, permission, parameters, count_data })
                        }
                    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));


                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
function freeBoardWrite(req, res, next) {
    let token = req.session.user;
    var parameters = {
        "name": 'vistors'
    }
    counterDAO.findCount(parameters).then(
        (count_data) => {
            jwtmiddle.jwtCerti(token).then(
                (permission) => {
                    if (permission.userId != undefined) {
                        res.render('board/free/FreeBoardWrite', { permission, count_data })
                    }
                    else {
                        res.send("<script>alert('Inaccessible');history.back();</script>")
                    }
                }
            ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
}
function freeBoardDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_freeBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');history.back();</script>"))
            }
        )
        .then(
            (db_values) => {
                return boardDAO.count_freeBoardComment(parameters)
                    .then((commentData) => { db_values.commentData = commentData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');history.back();</script>"))
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                res.render('board/free/freeBoardDetail', {
                                    dayjs, permission, count_data,
                                    detailData: db_values["detailData"],
                                    commentData: db_values["commentData"]
                                });
                            }
                        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
            }
        )
        .catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
function freeBoardComment(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    var comment = req.body.comment;
    if (comment == "") res.send("<script>alert('댓글을 입력하세요.');history.back();</script>")
    else {
        let token = req.session.user;
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                db.query(`INSERT freeBoardComment SET qid=?, comment=?, date=?, userId=?, userName=?`, [parameters.qid, comment, datetime, permission.userId, permission.userName], function (error, results) {
                    if (error) {
                        logger.error(
                            "DB error [freeBoardComment]" +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else {
                        res.redirect(`/board/free/freeBoardDetail?num=${parameters.qid}`)
                    }
                })
            })
    }
}
function freeBoardModify(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum,
        "name": 'vistors'
    };
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return boardDAO.count_freeBoardDetail(parameters)
                    .then((detailData) => { db_values.detailData = detailData; })
            }
        )
        .then(
            () => {
                counterDAO.findCount(parameters).then(
                    (count_data) => {
                        let token = req.session.user;
                        jwtmiddle.jwtCerti(token).then(
                            (permission) => {
                                if (permission.userId == db_values["detailData"][0].userId) {
                                    res.render('board/free/freeBoardModify', {
                                        dayjs, permission,
                                        detailData: db_values["detailData"]
                                    });
                                }
                                else {
                                    res.send("<script>alert('You do not have permission');history.back();</script>");
                                }
                            }
                        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
            }
        )
        .catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
function freeBoardModifyPost(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    let token = req.session.user;
    if (req.body.title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (req.body.content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                db.query(`UPDATE Free_Board SET title=?, content=?,date=? where qid=${parameters.qid}`, [req.body.title, req.body.content, datetime], function (error, results) {
                    if (error) {
                        logger.error(
                            "DB error [Free_Board]" +
                            "\n \t" + queryData +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else {
                        res.redirect('/board/free?page=1')
                    }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
    }
}
function freeBoardWritePost(req, res, next) {
    var content = req.body.content;
    var title = req.body.title;
    let token = req.session.user;
    if (title == "") res.send("<script>alert('제목을입력하세요.');history.back();</script>")
    else if (content == "") res.send("<script>alert('내용을입력하세요.');history.back();</script>")
    else {
        jwtmiddle.jwtCerti(token).then(
            (permission) => {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                var userId = permission.userId;
                var userName = permission.userName
                var datas = { userId: userId, title: title, content: content, date: datetime, userName: userName };
                db.query('INSERT INTO Free_Board SET ?', datas, function (error, row) {
                    if (error) {
                        logger.error(
                            "DB error [Free_Board]" +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    else { res.redirect("/board/free?page=1"); }
                })
            }
        ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
    }
}
async function freeBoardDelete(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    let token = req.session.user;
    jwtmiddle.jwtCerti(token).then(
        async (permission) => {
            db.query(`DELETE FROM freeBoardComment WHERE qid="${parameters.qid}"`)
            db.query(`DELETE FROM Free_Board WHERE qid="${parameters.qid}" && userId="${permission.userId}"`, function (error, row) {
                if (error) {
                    logger.error(
                        "DB error [Free_Board]" +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                if (row.affectedRows == 0) {
                    res.send("<script>alert('You do not have permission');history.back();</script>");
                }
                else {
                    res.redirect("/board/free?page=1")
                }
            })
        }
    ).catch(err => res.send("<script>alert('jwt err');history.back();</script>"));
}
async function noticeMainApp(req, res, next) {
    var queryToken = req.get('token')
    try {
        var parameters = {
            "name": 'vistors'
        }
        let token = req.session.user;
        const db_data = await boardDAO.count_noticeBoard(parameters)
        const cout_data = await counterDAO.findCount(parameters)
        const permission = await jwtmiddle.jwtCerti(queryToken)
        res.json({
            db_data
        })
    } catch (error) {
        res.json({
            "Message" : "실패하였습니다.",
            "Error_Message": error
        })
    }
}
module.exports = {
    noticeMainApp,
    noticeMain,
    noticeWrite,
    noticeDetail,
    noticeWritePost,
    noticeModify,
    noticeModifyPost,
    noticeDelete,
    inquiryMain,
    inquiryDetail,
    inquiryComment,
    inquiryWrite,
    inquiryWritePost,
    inquiryModify,
    inquiryModifyPost,
    inquiryDelete,
    freeBoardMain,
    freeBoardWrite,
    freeBoardDetail,
    freeBoardWritePost,
    freeBoardModify,
    freeBoardModifyPost,
    freeBoardDelete,
    freeBoardComment
}