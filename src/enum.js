/**
 * @fileoverview Enum을 구현한 모듈이 정의 되어있다.
 * @author 김성호 sungho-kim@nhnent.com
 * @dependency type, collection.js
 */

(function(ne) {

'use strict';

/* istanbul ignore if */
if (!ne) {
    ne = window.ne = {};
}
if (!ne.util) {
    ne.util = window.ne.util = {};
}

/**
 * definedProperty지원 여부 체크
 * @returns {boolean}
 */
var isSupportDefinedProperty = (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) {
        return false;
    }
}());

/**
 * 상수에 들어갈 임의의 값
 * @type {number}
 */
var enumValue = 0;

/**
 * Enum
 * 임의의 값이지만 중복되지 않는 값을 갖는 상수의 목록을 만든다
 * IE8이하를 제외한 모던브라우저에서는
 * 한번 결정된값은 추후 변경될수 없다(바꾸려고 시도해도 원래 값을 유지한다)
 *
 * @param {...string | string[]} itemList 상수목록, 스트링 배열 가능
 * @exports Enum
 * @constructor
 * @class
 * @memberof ne.util
 * @examples
 *
 * //생성
 * var MYENUM = new Enum('TYPE1', 'TYPE2');
 * var MYENUM2 = new Enum(['TYPE1', 'TYPE2']);
 *
 * //사용
 * if (value === MYENUM.TYPE1) {
 *      ....
 * }
 *
 * //추가하기(이미 정해진 상수명을 입력하는경우 무시된다)
 * MYENUM.set('TYPE3', 'TYPE4');
 *
 * //값을 이용해 상수명을 얻어오는 방법
 * MYENUM.getName(MYENUM.TYPE1); // 'TYPE1'이 리턴된다.
 *
 * //IE9이상의 브라우저와 기타 모던브라우저에서는 값이 변경되지 않는다.
 * var originalValue = MYENUM.TYPE1;
 * MYENUM.TYPE1 = 1234; // maybe TypeError
 * MYENUM.TYPE1 === originalValue; // true
 *
 **/
function Enum(itemList) {
    if (itemList) {
        this.set.apply(this, arguments);
    }
}

/**
 * set
 * 상수를 정의한다.
 * @param {...string| string[]} itemList 상수목록, 스트링 배열도
 */
Enum.prototype.set = function(itemList) {
    var self = this;

    if (!ne.util.isArray(itemList)) {
        itemList = ne.util.toArray(arguments);
    }

    ne.util.forEach(itemList, function itemListIteratee(item) {
        self._addItem(item);
    });
};

/**
 * getName
 * 값을 넘기면 해당하는 상수의 키값을 리턴해준다.
 * @param {number} value 비교할 값
 * @returns {string} 상수의 키값
 */
Enum.prototype.getName = function(value) {
    var foundedKey,
        self = this;

    ne.util.forEach(this, function(itemValue, key) {
        if (self._isEnumItem(key) && value === itemValue) {
            foundedKey = key;
            return false;
        }
    });

    return foundedKey;
};

/**
 * _addItem
 * 상수를 생성한다
 * @private
 * @param {string} name 상수명
 */
Enum.prototype._addItem = function(name) {
    var value;

    if (!this.hasOwnProperty(name)) {
        value = this._makeEnumValue();

        if (isSupportDefinedProperty) {
            Object.defineProperty(this, name, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: value
            });
        } else {
            this[name] = value;
        }
    }
};

/**
 * _makeEnumValue
 * 상수에 대입할 임의의 중복되지 않는 값을 구한다.
 * @private
 * @returns {number} 상수에 대입될 값
 */
Enum.prototype._makeEnumValue = function() {
    var value;

    value = enumValue;
    enumValue += 1;

    return value;
};

/**
 * _isEnumItem
 * 키의 이름을 입력받아 이 키에 해당하는 내용이 상수인지 아닌지를 판별한다
 * @param {string} key 프로퍼티 키값
 * @returns {boolean} 결과
 * @private
 */
Enum.prototype._isEnumItem = function(key) {
    return ne.util.isNumber(this[key]);
};

ne.util.Enum = Enum;

})(window.ne);
