const StoreService = require('../services/store_service');

class StoresController {
  storeService = new StoreService();

  //가게 등록
  createStore = async (req, res, next) => {
    try {
      const user_id = res.locals.user_id;
      const { name, call, category_id, address, content, img_url } = req.body;
      const createStoreData = await this.storeService.createStore(
        user_id,
        name,
        call,
        category_id,
        address,
        content,
        img_url
      );

      return res.status(201).json({ data: createStoreData });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: '가게 등록에 실패했습니다.' });
    }
  };

  //카테고리별 가게 조회
  readStore = async (req, res, next) => {
    try {
      const category_id = parseInt(req.query.category_id);

      const data = await this.storeService.readStore(category_id);

      if (!data) {
        return res
          .status(400)
          .json({ errorMessage: '데이터가 존재하지 않습니다.' });
      }
      const stores = data.map((d) => d.dataValues);

      res.render('category_store', { stores });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  };

  readStoreByKeyword = async (req, res, next) => {
    try {
      const keyword = req.query.keyword;
      if (keyword.length === 0) {
        return res.status(400).json({
          success: false,
          errorMessage: "'데이터 형식이 올바르지 않습니다.'",
        });
      }
      const data = await this.storeService.readStoreByKeyword(keyword);

      const stores = data.map((d) => d.dataValues);

      res.render('keyword', { stores });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  };

  readDetailStore = async (req, res, next) => {
    try {
      const store_id = parseInt(req.query.store_id);
      const store = await this.storeService.readDetailStore(store_id);
      if (!store) {
        return res
          .status(400)
          .json({ errorMessage: '데이터가 존재하지 않습니다.' });
      }
      if (!res.locals.isLoggedIn) {
        return res.render('store_detail', { store, isDibs: false });
      }
      const isDibs =
        store.store.dibs.indexOf(res.locals.user_id) !== -1 ? true : false;
      return res.render('store_detail', { store, isDibs });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error });
    }
  };

  //가게 수정
  updateStore = async (req, res, next) => {
    try {
      const { store_id } = req.params;
      const { name, call, category_id, address, content, img_url } = req.body;
      const [updateStoreData] = await this.storeService.updateStore(
        store_id,
        name,
        call,
        category_id,
        address,
        content,
        img_url
      );

      if (!updateStoreData) {
        return res.status(400).json({ data: '가게 수정에 실패했습니다.' });
      }
      return res.status(201).json({ data: '가게 수정에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '가게 수정에 실패했습니다.' });
    }
  };

  //가게 삭제
  deleteStore = async (req, res, next) => {
    try {
      const { store_id } = req.params;
      const deleteStoreData = await this.storeService.deleteStore(store_id);

      if (!deleteStoreData) {
        return res.status(400).json({ data: '가게 삭제에 실패했습니다.' });
      }
      return res.status(201).json({ data: '가게 삭제에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: '가게 삭제에 실패했습니다.' });
    }
  };

  //메뉴 등록
  createMenu = async (req, res, next) => {
    try {
      const { store_id } = req.params;
      const { name, price, img_url } = req.body;
      const createMenuData = await this.storeService.createMenu(
        store_id,
        name,
        price,
        img_url
      );

      return res.status(201).json({ data: createMenuData });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: '메뉴 등록에 실패했습니다.' });
    }
  };

  //메뉴 수정
  updateMenu = async (req, res, next) => {
    try {
      const { menu_id } = req.params;
      const { name, price, img_url } = req.body;
      const [updateMenuData] = await this.storeService.updateMenu(
        menu_id,
        name,
        price,
        img_url
      );

      if (!updateMenuData) {
        return res.status(400).json({ data: '메뉴 수정에 실패했습니다.' });
      }
      return res.status(201).json({ data: '메뉴 수정에 성공했습니다.' });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: '메뉴 수정에 실패했습니다.' });
    }
  };

  //메뉴 삭제
  deleteMenu = async (req, res, next) => {
    try {
      const { menu_id } = req.params;
      const deleteMenuData = await this.storeService.deleteMenu(menu_id);

      if (!deleteMenuData) {
        return res.status(400).json({ data: '메뉴 삭제에 실패했습니다.' });
      }
      return res.status(201).json({ data: '메뉴 삭제에 성공했습니다.' });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ errorMessage: '메뉴 삭제에 실패했습니다.' });
    }
  };
}

module.exports = StoresController;
