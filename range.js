$(function () {
    function Range() {
        this.maxPrice = 10000;//最大价格
        this.bWidth = 40;//滑块宽度
        this.eq = parseInt(this.bWidth / 3);//区间+滑块部分，防止滑块与滑块重叠
        this.cWidth = 300;//容器宽度
        this.qWidth = this.cWidth - this.bWidth;//容器总宽-单个滑块总宽=滑块范围区间
        this.actPrice = this.maxPrice / this.qWidth;//1px==?价格
        this.type = '';//当前滑块类型
        this.lock = 0;//滑块锁
        this.x = 0;//当前坐标
        this.o = 0;//记录鼠标点击位置
        this.min = 0;//坐标轴最小值
        this.max = this.qWidth;//坐标轴最大值
        this.root = null;//根节点
        this.dom = null;//当前按钮dom
        this.priceText = null;//展示数值dom
        this.axis = null;//坐标轴dom
        this.compare = null;//对比按钮的实例
        this.theme = null;//主题
    }

    Range.prototype.init = function (option) {
        if (!option) throw Error('init function param is Object');
        this.type = option.type;
        this.root = option.root;
        this.dom = option.dom;
        this.axis = option.axis;
        this.priceText = option.priceText;
        this.theme = option.theme;
        if (this.theme) {
            for (var key in this.theme) {
                this.dom.css('background', this.theme[key]);
            }
        }


        if (this.type == 'left') {
            this.x = parseInt(this.dom.css('left'));
        }
        else {
            this.x = parseInt(this.dom.css('right'));
        }

        this.dom.mousedown(this.start.bind(this));
        $(document).mouseup(this.up.bind(this));
    };
    Range.prototype.receive = function (obj) {
        this.compare = obj;
    };
    Range.prototype.start = function (e) {
        this.lock = 1;
        e = e || event;
        //e.pageX 属性返回鼠标指针的位置，相对于文档的左边缘。
        this.o = e.pageX - this.x;
        this.dom.css('zIndex', 4);
        this.compare.dom.css('zIndex', 3);
        $(document).mousemove(this.move.bind(this));
    };
    Range.prototype.move = function (e) {
        e = e || event;
        e.stopPropagation();
        e.preventDefault();
        if (!this.lock) return;
        if (this.type == 'left') {
            if ((e.pageX - this.o) < this.min ||
                Math.abs(e.pageX - this.o) > (this.max - Math.abs(this.compare.x) - this.eq)) return;
            this.x = e.pageX - this.o;
            this.dom.css('left', this.x);
            this.axis.css({
                'left': this.x,
                'width': this.cWidth - Math.abs(this.x) - Math.abs(this.compare.x)
            });
            // this.dom.text(this.x);
            this.priceText.text(this.x * this.actPrice);
        }
        else {
            if (e.pageX - this.o > this.min ||
                Math.abs(e.pageX - this.o) > (this.max - Math.abs(this.compare.x) - this.eq)) return;
            this.x = e.pageX - this.o;
            this.dom.css('right', Math.abs(this.x));
            this.axis.css({
                'right': Math.abs(this.x),
                'width': this.cWidth - Math.abs(this.x) - Math.abs(this.compare.x)
            });
            // this.dom.text(Math.abs(this.x));
            this.priceText.text(Math.abs(this.x) * this.actPrice);
        }
    };
    Range.prototype.up = function (e) {
        if (!this.lock) return;
        this.lock = 0;
        e = e || event;
        //为了解除move事件默认行为
        $(document).off('mousemove');
    };

    var r1 = new Range();
    r1.init({
        type: 'left',
        theme: {
            background: '#017959',
        },
        root: $('.range'),
        dom: $('.left'),
        compare: $('.right'),
        priceText: $('.left-text'),
        axis: $('.selection')
    });

    var r2 = new Range();
    r2.init({
        type: 'right',
        theme: {
            background: '#017959',
        },
        root: $('.range'),
        dom: $('.right'),
        compare: $('.left'),
        priceText: $('.right-text'),
        axis: $('.selection')
    });
    r1.receive(r2);
    r2.receive(r1);
});


function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}
