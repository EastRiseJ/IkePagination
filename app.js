$(() => {

});

let pagination = new IkePagination('.my-pagination', {
    pageIndex: 1,
    pageSize: 10,
    total: 36,
    pre (pageIndex, pageSize) {
        console.log('pre', pageIndex, pageSize);
    },
    next (pageIndex, pageSize) {
        console.log('next', pageIndex, pageSize);
    },
    pageChange (pageIndex, pageSize) {
        console.log('pageChange', pageIndex, pageSize);
    }

});