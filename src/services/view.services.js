export default class ViewsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    getProductsPaginate = async(limit, page, sort, category) => {
        return this.dao.getProductsPaginate(limit, page, sort, category)
    }

    getAllProducts = async() => {
        return this.dao.getAllProducts();
    }

    getProductDetail = async(id) => {
        return this.dao.getProductDetail(id)
    }
}