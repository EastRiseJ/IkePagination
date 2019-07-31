class IkePagination {
    constructor (el, options) {
        this.el = el;
        this.options = {
            __pageIndex__: 1,	// 初始页码
            pageIndex: 1,	// 页码
            pageSize: 10,	// 每页显示的数量
            total: 10,	// 总数
            preText: 'pre',	// 前一页按钮文字显示
            nextText: 'next',	// 后一页按钮文字显示
            pre () {},	// 点击前一页回调
            next () {},	// 点击后一页回调
            pageChange () {},	// 页码改变时
        };
        // Object.assign 不兼容ie (┬＿┬) 换个方法
        // Object.assign(this.options, options);

        // 循环大法
        for (let k in options) {
            this.options[k] = options[k];
        }

        this.init();
    }

    init () {
        this.renderMoreDom();
        this.bindEvents();
        this.btnStatusChange();
        this.watchObj();
    }

    bindEvents () {
        $(document).on('click', `${this.el} .pre`, this.prePage.bind(this))
        $(document).on('click', `${this.el} .next`, this.nextPage.bind(this))
        $(document).on('click', `${this.el} a.pagenum`, this.selectPage.bind(this))
    }

    /**
     * 改变总数 重新渲染组件
     */
    changeTotal (newTotal) {
        if (this.options.total !== newTotal) {
            this.options.total = newTotal;
            // this.options.pageIndex = 1;
            this.renderMoreDom();
            this.btnStatusChange();
        }
    }

    /**
     * 监听pageIndex的变化
     */
    watchObj () {
        const _this = this;
        this.options['__pageIndex__'] = this.options['pageIndex'];
        Object.defineProperty(this.options, 'pageIndex', {
            // writable: true,
            enumerable : true,
            configurable : true,
            get () {
                return _this.options['__pageIndex__'];
            },
            set (val) {
                _this.options['__pageIndex__'] = val;

                setTimeout(() => {
                    _this.renderMoreDom();
                    _this.pageIndexActive();
                    _this.btnStatusChange();
                }, 0)

                // 事件回调
                _this.options.pageChange && _this.options.pageChange(_this.options.pageIndex, _this.options.pageSize);
            }
        })
    }

    /**
     * 特定情况加 '…'
     */
    addMoreText () {
        let newVal = parseInt(this.options['__pageIndex__'], 10);

    }

    /**
     * 高亮当前页面
     */
    pageIndexActive () {
        const $paginationBox = $(`${this.el} .ikePagination`);
        $paginationBox.find('a').removeClass('active');
        $paginationBox.find(`a[data-pagenum="${this.options['__pageIndex__']}"]`).addClass('active');
    }

    /**
     * 改变按钮可点击状态样式
     */
    btnStatusChange () {
        let newVal = parseInt(this.options['__pageIndex__'], 10),
            min = 1,
            max = Math.ceil(this.options.total / this.options.pageSize);
        if (max <= 1 || this.options.total <= 1) {
            $(this.el + ' .pre').addClass('disabled');
            $(this.el + ' .next').addClass('disabled');
        } else {
            if (newVal === max) {
                $(this.el + ' .next').addClass('disabled');
            } else {
                $(this.el + ' .next').removeClass('disabled');
            }

            if (newVal === min) {
                $(this.el + ' .pre').addClass('disabled');
            } else {
                $(this.el + ' .pre').removeClass('disabled');
            }
        }
    }

    /**
     * 选择页面
     */
    selectPage (e) {
        this.options.pageIndex = $(e.target).data().pagenum;
    }

    /**
     * 上一页
     */
    prePage () {
        this.options.pageIndex --;
        this.options.pre && this.options.pre(this.options.pageIndex, this.options.pageSize);
    }
    /**
     *  下一页
     */
    nextPage () {
        this.options.pageIndex ++;
        this.options.next && this.options.next(this.options.pageIndex, this.options.pageSize);
    }

    /**
     * 根据当前页码渲染Dom
     */
    renderMoreDom () {
        const $paginationBox = $(`<div class="ikePagination"></div>`);
        $paginationBox.html();
        const maxNum = Math.ceil(this.options.total / this.options.pageSize);
        // 当maxNum <= 1 时显示
        if (maxNum === 0) {
            $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${this.options.preText}</a>`));
            $paginationBox.append(`<span href="javascript:;" >0</span>`);
            $paginationBox.append($(`<a href="javascript:;" disabled class="next">${this.options.nextText}</a>`));
        } else if (maxNum === 1) {
            $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${this.options.preText}</a>`));
            $paginationBox.append(`<a href="javascript:;" class="pagenum active"  data-pagenum="${maxNum}">${maxNum}</a>`);
            $paginationBox.append($(`<a href="javascript:;" disabled class="next">${this.options.nextText}</a>`));
        } else {

            const thePageIndex = this.options.__pageIndex__;
            $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${this.options.preText}</a>`));
            $paginationBox.append('<a href="javascript:;" class="pagenum"  data-pagenum="1">1</a>');
            if (maxNum <= 10) {
                let $aPage;
                for (let i = 2; i <= maxNum - 1; i++) {
                    $aPage = $(`<a href="javascript:;" class="pagenum"  data-pagenum="${i}">${i}</a>`);
                    $paginationBox.append($aPage);
                }
            } else if (thePageIndex < 5) {
                for (let i = 2; i <= 5; i++) {
                    $paginationBox.append(`<a href="javascript:;" class="pagenum"  data-pagenum="${i}">${i}</a>`);
                }
                $paginationBox.append('<span>…</span>');
            } else if (thePageIndex >= 5 && thePageIndex <= (maxNum - 5)) {
                $paginationBox.append('<span>…</span>');

                for (let i = thePageIndex - 2; i <= thePageIndex + 2; i++) {
                    $paginationBox.append(`<a href="javascript:;" class="pagenum"  data-pagenum="${i}">${i}</a>`);
                }
                $paginationBox.append('<span>…</span>');
            } else if (thePageIndex > (maxNum - 5)) {

                $paginationBox.append('<span>…</span>');

                for (let i = maxNum - 5; i <= (maxNum - 1); i++) {
                    $paginationBox.append(`<a href="javascript:;" class="pagenum"  data-pagenum="${i}">${i}</a>`);
                }
            }
            $paginationBox.append(`<a href="javascript:;" class="pagenum"  data-pagenum="${maxNum}">${maxNum}</a>`);
            $paginationBox.append($(`<a href="javascript:;" class="next">${this.options.nextText}</a>`));
            $paginationBox.find(`a[data-pagenum="${thePageIndex}"]`).addClass('active');
        }

        $(this.el).html($paginationBox);
    }

}