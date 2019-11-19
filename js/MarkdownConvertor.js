function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { console.log();if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

requirejs(['tui-editor', 'katex'], function (Editor, katex) {
  

  var Instance = Editor.getInstances();

  //var Convertor = Instance[0].convertor;

  for(i in Instance){
    if(!isNaN(parseInt(i))){
       var Convertor  = Instance[0];
    }
}
  
  console.log(typeof Instance);
  
  var MarkdownConvertor =
  /*#__PURE__*/
  function (_Editor$Convertor) {
    _inherits(MarkdownConvertor, _Editor$Convertor);

    function MarkdownConvertor(em) {
      _classCallCheck(this, MarkdownConvertor);

      return _possibleConstructorReturn(this, (MarkdownConvertor.__proto__ || Object.getPrototypeOf(MarkdownConvertor)).call(this, em));
    }

    _createClass(MarkdownConvertor, [{
      key: "toHTML",
      value: function toHTML(markdown) {
        var math_render = katex.renderToString;
        var option = {
          renderer: function renderer(text, type) {
            if (type === 'InlineMath') {
              return '<span style="display: inline;">' + math_render(text, {
                displayMode: false
              }) + '</span>';
            } else // type === 'DisplayMath'
              {
                return '<span style="display: block;">' + math_render(text, {
                  displayMode: true
                }) + '</span>';
              }
          }
        };
        markdown = option.renderer(markdown);
        markdown = option.renderer(markdown, 'DisplayMath');
        return _get(MarkdownConvertor.prototype.__proto__ || Object.getPrototypeOf(MarkdownConvertor.prototype), "toHTML", this).call(this, markdown);
      }
    }]);

    return MarkdownConvertor;
  }(Convertor);

  module.exports.MarkdownConvertor = MarkdownConvertor;
});