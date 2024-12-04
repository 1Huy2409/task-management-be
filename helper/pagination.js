module.exports = (query, paginationObject, countTasks) => {
    if (query.page) {
        paginationObject.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        paginationObject.limitTasks = parseInt(query.limit);
    }
    paginationObject.skipTasks = (paginationObject.currentPage-1)*paginationObject.limitTasks;
    paginationObject.totalPages = Math.ceil(countTasks/paginationObject.limitTasks);
    return paginationObject;
}