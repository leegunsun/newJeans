const Boom = require("boom");
const Joi = require("joi");
const CardpostsService = require("../services/cardposts.service");
const CardpostsRepository = require("../repositories/cardposts.repository");

class CardpostsController {
  constructor() {
    this.cardpostsService = new CardpostsService();
    this.cardpostsRepository = new CardpostsRepository();
  }

  // splitNumber쿼리로 지정한 수 만큼 카드를 불러들입니다.
  findSplitCards = async (req, res, next) => {
    const { maincategory, category, splitNumber, splitPageNumber } = req.query;
    try {
      const findSplitCards = await this.cardpostsService.findSplitCards(
        maincategory,
        category,
        splitNumber,
        splitPageNumber
      );

      if (!findSplitCards) {
        throw Boom.notFound("페이지가 존재하지 않습니다.");
      }

      return res.status(200).json({ postCards: findSplitCards });
    } catch (error) {
      throw error;
    }
  };

  // 특정 로직을 세우고 가장 인기있는 게시물 3개를 가져옵니다.
  findHotCards = async (req, res, next) => {
    try {
      const hotPostCards = await this.cardpostsService.findHotCards();

      if (!hotPostCards) {
        throw Boom.notFound("인기 있는 게시글이 존재하지 않습니다.");
      }

      return res.status(200).json({ postCards: hotPostCards });
    } catch (error) {
      throw error;
    }
  };

  // postIdx로 지정한 카드를 불러들입니다.
  findOnePost = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.badRequest("postIdx가 입력되지 않았습니다.");
      }

      const findOnePost = await this.cardpostsService.findOnePost(postIdx);

      if (!findOnePost) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      return res.status(200).json({ post: findOnePost });
    } catch (error) {
      throw error;
    }
  };

  // 새로운 post를 등록합니다..
  postCard = async (req, res, next) => {
    const { title, maincategory, category, desc, tag, pollTitle } = req.body;
    const { email } = res.locals.user;
    const uploadUrlArray = req.files;
    const imgUrl = "";

    try {
      if (userIdx) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!title || !category || !desc) {
        throw Boom.badRequest("title, category, desc는 비어있을 수 없습니다.");
      }

      if (uploadUrlArray) {
        imgUrl = await uploadUrlArray.map((x) => x.location);
      }

      const findOneUser = await this.cardpostsRepository.findOneUser(email);
      const userIdx = findOneUser.userIdx;
      await this.cardpostsService.postCard(
        userIdx,
        title,
        maincategory,
        category,
        desc,
        tag,
        imgUrl,
        pollTitle
      );
      return res.status(200).json({ msg: "게시글 작성에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트를 업데이트 합니다.
  updatePost = async (req, res, next) => {
    const { userIdx } = res.locals.user;
    const { postIdx } = req.params;
    const { title, maincategory, category, desc, tag, pollTitle } = req.body;
    const uploadUrlArray = req.files;
    const imgUrl = "";

    try {
      if (userIdx) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      if (uploadUrlArray) {
        imgUrl = await uploadUrlArray.map((x) => x.location);
      }

      await this.cardpostsService.updatePost(
        userIdx,
        postIdx,
        title,
        maincategory,
        category,
        desc,
        tag,
        imgUrl,
        pollTitle
      );
      return res.status(200).json({ msg: "게시글 수정에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트를 삭제합니다.
  deletePost = async (req, res, next) => {
    const { userIdx } = res.locals.user;
    const { postIdx } = req.params;

    try {
      if (userIdx) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      await this.cardpostsService.deletePost(userIdx, postIdx);
      res.status(200).json({ msg: "게시글 삭제에 성공했습니다." });
    } catch (error) {
      throw error;
    }
  };

  // 포스트에 투표합니다.
  postPoll = async (req, res, next) => {
    const { postIdx } = req.params;
    const { proInputValue, conInputValue } = req.body;
    const { userIdx } = res.locals.user;

    try {
      if (userIdx) {
        throw Boom.badRequest(
          "res.locals.user에 userIdx 값이 존재하지 않습니다."
        );
      }

      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const pollResult = await this.cardpostsService.postPoll(
        userIdx,
        postIdx,
        proInputValue,
        conInputValue
      );

      return res.status(200).json({ pollResult });
    } catch (error) {
      throw error;
    }
  };

  // 포스트에 투표 결과를 봅니다.
  postPollResult = async (req, res, next) => {
    const { postIdx } = req.params;

    try {
      if (!postIdx) {
        throw Boom.notFound(
          `postIdx : [${postIdx}] 게시글이 존재하지 않습니다.`
        );
      }

      const pollResult = await this.cardpostsService.postPollResult(postIdx);
      return res.status(200).json({ pollResult });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CardpostsController;
