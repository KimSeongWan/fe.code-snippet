/**
 * @fileoverview Hash Map을 구현한 모듈이 정의 되어있다.
 * @author FE개발팀
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
     * 해쉬맵에서 사용하는 데이터는 _MAPDATAPREFIX로 시작한다.
     * @type {string}
     * @private
     */
    var _MAPDATAPREFIX = 'å';

    /**
     * HashMap
     * 키/밸류로 데이터를 관리할수있다(자바의 hashMap과 유사)
     * 주의) length프로퍼티를 가지고있어 유사 배열을 length의 유무로 체크하는 로직에서 의도되지 않은 동작을 할수있다.
     * @param {Object} [obj] 인스턴스가 만들어질때 셋팅할 초기 데이터
     * @constructor
     * @memberof ne.util
     * @example
     * var hm = new HashMap({
     *     'mydata': {
     *          'hello': 'imfine'
     *      },ne.util.HashMap
     *     'what': 'time'
     * });
     */
    function HashMap(obj) {
        /**
         * 사이즈
         * @type {number}
         */
        this.length = 0;

        if (obj) {
            this.setObject(obj);
        }
    }

    /**
     * 키/밸류 혹은 Object를 전달하여 데이터를 셋팅한다.
     * @param {String|Object} key 키에 해당하는 스트링이나 객체
     * @param {*} [value] 데이터
     * @example
     * var hm = new HashMap();
     *
     * hm.set('key', 'value');
     * hm.set({
     *     'key1': 'data1',
     *     'key2': 'data2'
     * });
     */
    HashMap.prototype.set = function(key, value) {
        if(arguments.length === 2) {
            this.setKeyValue(key, value);
        } else {
            this.setObject(key);
        }
    };

    /**
     * 키/밸류로 데이터를 셋팅한다.
     * @param {String} key 키스트링
     * @param {*} value 데이터
     * @example
     * var hm = new HashMap();
     * hm.setKeyValue('key', 'value');
     */
    HashMap.prototype.setKeyValue = function(key, value) {
        if (!this.has(key)) {
            this.length += 1;
        }
        this[this.encodeKey(key)] = value;
    };

    /**
     * 객체로 데이터를 셋팅한다.
     * @param {Object} obj
     * @example
     * var hm = new HashMap();
     *
     * hm.setObject({
     *     'key1': 'data1',
     *     'key2': 'data2'
     * });
     */
    HashMap.prototype.setObject = function(obj) {
        var self = this;

        ne.util.forEachOwnProperties(obj, function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * 해쉬맵을 인자로 받아 병합한다.
     * @param {HashMap} hashMap
     */
    HashMap.prototype.merge = function(hashMap) {
        var self = this;

        hashMap.each(function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * 해쉬맵에서 사용할 키를 생성한다.
     * @param {String} key
     * @returns {string}
     * @private
     */
    HashMap.prototype.encodeKey = function(key) {
        return _MAPDATAPREFIX + key;
    };

    /**
     * 해쉬맵키에서 실제 키를 가져온다.
     * @param {String} key
     * @returns {String}
     * @private
     */
    HashMap.prototype.decodeKey = function(key) {
        var decodedKey = key.split(_MAPDATAPREFIX);
        return decodedKey[decodedKey.length-1];
    };

    /**
     * 키값을 전달하여 데이터를 반환한다.
     * @param {String} key
     * @returns {*}
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     *
     * hm.get('key') // value
     */
    HashMap.prototype.get = function(key) {
        return this[this.encodeKey(key)];
    };

    /**
     * 키를 전달하여 데이터가 존재하는지 체크한다.
     * @param {String} key
     * @returns {boolean}
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     *
     * hm.has('key') // true
     */
    HashMap.prototype.has = function(key) {
        return this.hasOwnProperty(this.encodeKey(key));
    };

    /**
     * 키나 키의 목록을 전달하여 데이터를 삭제한다.
     * @param {...String|String[]} key
     * @returns {String|String[]}
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     * hm.set('key2', 'value');
     *
     * //ex1
     * hm.remove('key');
     *
     * //ex2
     * hm.remove('key', 'key2');
     *
     * //ex3
     * hm.remove(['key', 'key2']);
     */
    HashMap.prototype.remove = function(key) {
        if (arguments.length > 1) {
            key = ne.util.toArray(arguments);
        }

        return ne.util.isArray(key) ? this.removeByKeyArray(key) : this.removeByKey(key);
    };

    /**
     * 키를 전달하여 데이터를 삭제한다.
     * @param {String} key
     * @returns {*|null} 삭제된 데이터
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     *
     * hm.removeByKey('key')
     */
    HashMap.prototype.removeByKey = function(key) {
        var data = this.has(key) ? this.get(key) : null;

        if (data !== null) {
            delete this[this.encodeKey(key)];
            this.length -= 1;
        }

        return data;
    };

    /**
     * 키의 목록을 전달하여 데이터를 삭제한다.
     * @param {String[]} keyArray
     * @returns {String[]} 삭제된 데이터
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     * hm.set('key2', 'value');
     *
     * hm.removeByKeyArray(['key', 'key2']);
     */
    HashMap.prototype.removeByKeyArray = function(keyArray) {
        var data = [],
            self = this;

        ne.util.forEach(keyArray, function(key) {
            data.push(self.removeByKey(key));
        });

        return data;
    };

    /**
     * 모든데이터를 지운다.
     */
    HashMap.prototype.removeAll = function() {
        var self = this;

        this.each(function(value, key) {
            self.remove(key);
        });
    };

    /**
     * 데이터를 순회하며 콜백에 전달해준다.
     * @param {Function} iteratee
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     * hm.set('key2', 'value');
     *
     * hm.each(function(value, key) {
     *     //do something...
     * });
     */
    HashMap.prototype.each = function(iteratee) {
        var self = this,
            flag;

        ne.util.forEachOwnProperties(this, function(value, key) {
            if (key.charAt(0) === _MAPDATAPREFIX) {
                flag = iteratee(value, self.decodeKey(key));
            }

            if (flag === false) {
                return flag;
            }
        });
    };

    /**
     * 저장된 키의 목록을 배열로 리턴해준다.
     * @returns {Array}
     * @example
     * var hm = new HashMap();
     * hm.set('key', 'value');
     * hm.set('key2', 'value');
     *
     * hm.keys();  //['key', 'key2');
     */
    HashMap.prototype.keys = function() {
        var keys = [],
            self = this;

        this.each(function(value, key) {
            keys.push(self.decodeKey(key));
        });

        return keys;
    };

    /**
     * 조건을 체크하는 콜백을 전달받아 데이터를 전달해주고 콜백의 결과가 true인경우의 데이터를 모와 배열로 만들어 리턴해준다.
     * @param {Function} condition
     * @returns {Array}
     * @example
     *
     * //ex1
     * var hm = new HashMap();
     * hm.set('key', 'value');
     * hm.set('key2', 'value');
     *
     * hm.find(function(value, key) {
     *     return key === 'key2';
     * }); // ['value']
     *
     * //ex2
     * var hm = new HashMap({
     *     'myobj1': {
     *          visible: true
     *      },
     *     'mybobj2': {
     *          visible: false
     *      }
     * });
     *
     * hm.find(function(obj, key) {
     *     return obj.visible === true;
     * }); // [{visible: true}];
     */
    HashMap.prototype.find = function(condition) {
        var founds = [];

        this.each(function(value, key) {
            if (condition(value, key)) {
                founds.push(value);
            }
        });

        return founds;
    };

    /**
     * 내부의 값들을 순서에 상관없이 배열로 반환한다
     * @returns {Array}
     */
    HashMap.prototype.toArray = function() {
        var result = [];

        this.each(function(v) {
            result.push(v);
        });

        return result;
    };

    ne.util.HashMap = HashMap;

})(window.ne);
