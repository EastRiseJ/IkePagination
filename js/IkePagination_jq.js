(function ($) {
    $.fn.ikePagination = function (options) {
        var defaults = {
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
        var settings = $.extend(defaults, options);
        init(this);
        /**
         * 初始化
         */
        function init (self) {
            renderMoreDom(self);
            bindEvents(self);
            btnStatusChange(self);
            watchObj(self);
        }

        /**
         * 监听pageIndex的变化
         */
        function watchObj (self) {
            const _this = this;
            settings['__pageIndex__'] = settings['pageIndex'];
            Object.defineProperty(settings, 'pageIndex', {
                // writable: true,
                enumerable : true,
                configurable : true,
                get () {
                    return settings['__pageIndex__'];
                },
                set (val) {
                    settings['__pageIndex__'] = val;

                    setTimeout(() => {
                        renderMoreDom(self);
                        pageIndexActive(self);
                        btnStatusChange(self);
                    }, 0)

                    // 事件回调
                    settings.pageChange && settings.pageChange(settings.pageIndex, settings.pageSize);
                }
            })
        }

        /**
         * 高亮当前页面
         */
        function pageIndexActive (self) {
            const $paginationBox = self.find('.ikePagination');
            $paginationBox.find('a').removeClass('active');
            $paginationBox.find(`a[data-pagenum="${settings['__pageIndex__']}"]`).addClass('active');
        }

        /**
         * 改变按钮可点击状态样式
         */
        function btnStatusChange (self) {
            let newVal = parseInt(settings['__pageIndex__'], 10),
                min = 1,
                max = Math.ceil(settings.total / settings.pageSize);
            if (max <= 1 || settings.total <= 1) {
                self.find('.pre').addClass('disabled');
                self.find('.next').addClass('disabled');
            } else {
                if (newVal === max) {
                    self.find('.next').addClass('disabled');
                } else {
                    self.find('.next').removeClass('disabled');
                }

                if (newVal === min) {
                    self.find('.pre').addClass('disabled');
                } else {
                    self.find('.pre').removeClass('disabled');
                }
            }
        }

        /**
         * 事件绑定
         */
        function bindEvents (self) {
            $(document).on('click', `${self.selector} .pre`, prePage)
            $(document).on('click', `${self.selector} .next`, nextPage)
            $(document).on('click', `${self.selector} a.pagenum`, selectPage)
        }

        /**
         * 选择页面
         */
        function selectPage (e) {
            settings.pageIndex = $(e.target).data().pagenum;
        }

        /**
         * 上一页
         */
        function prePage () {
            settings.pageIndex --;
            settings.pre && settings.pre(settings.pageIndex, settings.pageSize);
        }

        /**
         *  下一页
         */
        function nextPage () {
            settings.pageIndex ++;
            settings.next && settings.next(settings.pageIndex, settings.pageSize);
        }

         /**
         * 根据当前页码渲染Dom
         */
         function renderMoreDom (self) {
            const $paginationBox = $(`<div class="ikePagination"></div>`);
            $paginationBox.html();
            const maxNum = Math.ceil(settings.total / settings.pageSize);
            // 当maxNum <= 1 时显示
            if (maxNum === 0) {
                $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${settings.preText}</a>`));
                $paginationBox.append(`<span href="javascript:;" >0</span>`);
                $paginationBox.append($(`<a href="javascript:;" disabled class="next">${settings.nextText}</a>`));
            } else if (maxNum === 1) {
                $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${settings.preText}</a>`));
                $paginationBox.append(`<a href="javascript:;" class="pagenum active"  data-pagenum="${maxNum}">${maxNum}</a>`);
                $paginationBox.append($(`<a href="javascript:;" disabled class="next">${settings.nextText}</a>`));
            } else {

                const thePageIndex = settings.__pageIndex__;
                $paginationBox.append($(`<a href="javascript:;" disabled class="pre">${settings.preText}</a>`));
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
                $paginationBox.append($(`<a href="javascript:;" class="next">${settings.nextText}</a>`));
                $paginationBox.find(`a[data-pagenum="${thePageIndex}"]`).addClass('active');
            }
             self.html($paginationBox);
        }

        return this;
    }
})(jQuery)