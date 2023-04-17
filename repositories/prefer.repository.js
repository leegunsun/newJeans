const {
  Prefer,
  CardPost,
  Comment,
  PostLike,
  CommentLike,
} = require("../models");
const { Op } = require("sequelize");

// selectprefer: 0 디폴트
// 7. 포스트 찬성 8. 포스트 반대.

class PreferRepository {
  /**
   * property 테이블에 조건에 맞는 데이터가 존재하는지 검색합니다.
   */
  findUserLike = async (tableIdx, property) => {
    switch (property) {
      case "PostLike":
        return await CardPost.findOne({
          where: { postIdx: tableIdx },
        });
      case "CommentLike":
        return await Comment.findOne({
          where: { commentIdx: tableIdx },
        });
    }
  };

  /**
   * 포스트에 대해서 찬성표를 던집니다.
   */
  postProInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "7", // 포스트 찬성
    });

    return;
  };

  // 포스트에 대해서 반대표를 던집니다.
  postConInput = async (userIdx, postIdx) => {
    await Prefer.create({
      userIdx: userIdx,
      postIdx: postIdx,
      selectprefer: "8", // 포스트 반대
    });

    return;
  };

  // 포스트의 찬성표를 집계합니다.
  postProCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "7" },
    });
  };

  // 포스트의 반대표를 집계합니다.
  postConCount = async (postIdx) => {
    return await Prefer.count({
      where: { postIdx: postIdx, selectprefer: "8" },
    });
  };
}

module.exports = PreferRepository;
