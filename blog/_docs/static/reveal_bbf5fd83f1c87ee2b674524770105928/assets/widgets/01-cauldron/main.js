'use strict';
var $p;
var $fileLevelThis = this;
var $getOwnPropertyDescriptors = (Object.getOwnPropertyDescriptors || (() => {
  var ownKeysFun;
  if ((((typeof Reflect) !== "undefined") && Reflect.ownKeys)) {
    ownKeysFun = Reflect.ownKeys;
  } else {
    var getOwnPropertySymbols = (Object.getOwnPropertySymbols || ((o) => []));
    ownKeysFun = ((o) => Object.getOwnPropertyNames(o).concat(getOwnPropertySymbols(o)));
  }
  return ((o) => {
    var ownKeys = ownKeysFun(o);
    var descriptors = ({});
    var len = (ownKeys.length | 0);
    var i = 0;
    while ((i !== len)) {
      var key = ownKeys[i];
      Object.defineProperty(descriptors, key, ({
        "configurable": true,
        "enumerable": true,
        "writable": true,
        "value": Object.getOwnPropertyDescriptor(o, key)
      }));
      i = ((i + 1) | 0);
    }
    return descriptors;
  });
})());
function $Char(c) {
  this.c = c;
}
$p = $Char.prototype;
$p.toString = (function() {
  return String.fromCharCode(this.c);
});
function $Long(lo, hi) {
  this.l = lo;
  this.h = hi;
}
$p = $Long.prototype;
$p.toString = (function() {
  return $s_RTLong__toString__I__I__T(this.l, this.h);
});
function $noIsInstance(arg0) {
  throw new TypeError("Cannot call isInstance() on a Class representing a JS trait/object");
}
function $objectClone(arg0) {
  return Object.create(Object.getPrototypeOf(arg0), $getOwnPropertyDescriptors(arg0));
}
function $objectOrArrayClone(arg0) {
  return (arg0.$classData.Z ? arg0.e() : $objectClone(arg0));
}
function $objectGetClass(arg0) {
  switch ((typeof arg0)) {
    case "string": {
      return $d_T.l();
    }
    case "number": {
      if ($isInt(arg0)) {
        if ((((arg0 << 24) >> 24) === arg0)) {
          return $d_jl_Byte.l();
        } else if ((((arg0 << 16) >> 16) === arg0)) {
          return $d_jl_Short.l();
        } else {
          return $d_jl_Integer.l();
        }
      } else if ($isFloat(arg0)) {
        return $d_jl_Float.l();
      } else {
        return $d_jl_Double.l();
      }
    }
    case "boolean": {
      return $d_jl_Boolean.l();
    }
    case "undefined": {
      return $d_jl_Void.l();
    }
    default: {
      if ((arg0 instanceof $Long)) {
        return $d_jl_Long.l();
      } else if ((arg0 instanceof $Char)) {
        return $d_jl_Character.l();
      } else if ((!(!(arg0 && arg0.$classData)))) {
        return arg0.$classData.l();
      } else {
        return null;
      }
    }
  }
}
function $objectClassName(arg0) {
  switch ((typeof arg0)) {
    case "string": {
      return "java.lang.String";
    }
    case "number": {
      if ($isInt(arg0)) {
        if ((((arg0 << 24) >> 24) === arg0)) {
          return "java.lang.Byte";
        } else if ((((arg0 << 16) >> 16) === arg0)) {
          return "java.lang.Short";
        } else {
          return "java.lang.Integer";
        }
      } else if ($isFloat(arg0)) {
        return "java.lang.Float";
      } else {
        return "java.lang.Double";
      }
    }
    case "boolean": {
      return "java.lang.Boolean";
    }
    case "undefined": {
      return "java.lang.Void";
    }
    default: {
      if ((arg0 instanceof $Long)) {
        return "java.lang.Long";
      } else if ((arg0 instanceof $Char)) {
        return "java.lang.Character";
      } else if ((!(!(arg0 && arg0.$classData)))) {
        return arg0.$classData.N;
      } else {
        return null.ro();
      }
    }
  }
}
function $dp_equals__O__Z(instance, x0) {
  switch ((typeof instance)) {
    case "string": {
      return $f_T__equals__O__Z(instance, x0);
    }
    case "number": {
      return $f_jl_Double__equals__O__Z(instance, x0);
    }
    case "boolean": {
      return $f_jl_Boolean__equals__O__Z(instance, x0);
    }
    case "undefined": {
      return $f_jl_Void__equals__O__Z(instance, x0);
    }
    default: {
      if (((!(!(instance && instance.$classData))) || (instance === null))) {
        return instance.l(x0);
      } else if ((instance instanceof $Long)) {
        return $f_jl_Long__equals__O__Z(instance.l, instance.h, x0);
      } else if ((instance instanceof $Char)) {
        return $f_jl_Character__equals__O__Z(instance.c, x0);
      } else {
        return $c_O.prototype.l.call(instance, x0);
      }
    }
  }
}
function $dp_hashCode__I(instance) {
  switch ((typeof instance)) {
    case "string": {
      return $f_T__hashCode__I(instance);
    }
    case "number": {
      return $f_jl_Double__hashCode__I(instance);
    }
    case "boolean": {
      return $f_jl_Boolean__hashCode__I(instance);
    }
    case "undefined": {
      return $f_jl_Void__hashCode__I(instance);
    }
    default: {
      if (((!(!(instance && instance.$classData))) || (instance === null))) {
        return instance.r();
      } else if ((instance instanceof $Long)) {
        return $f_jl_Long__hashCode__I(instance.l, instance.h);
      } else if ((instance instanceof $Char)) {
        return $f_jl_Character__hashCode__I(instance.c);
      } else {
        return $c_O.prototype.r.call(instance);
      }
    }
  }
}
function $dp_indexOf__I__I(instance, x0) {
  if (((typeof instance) === "string")) {
    return $f_T__indexOf__I__I(instance, x0);
  } else {
    return instance.rp(x0);
  }
}
function $dp_toString__T(instance) {
  return ((instance === (void 0)) ? "undefined" : instance.toString());
}
function $checkIntDivisor(arg0) {
  if ((arg0 === 0)) {
    throw new $c_jl_ArithmeticException("/ by zero");
  } else {
    return arg0;
  }
}
function $doubleToInt(arg0) {
  return ((arg0 > 2147483647) ? 2147483647 : ((arg0 < (-2147483648)) ? (-2147483648) : (arg0 | 0)));
}
function $cToS(arg0) {
  return String.fromCharCode(arg0);
}
var $fpBitsDataView = new DataView(new ArrayBuffer(8));
function $floatToBits(arg0) {
  var dataView = $fpBitsDataView;
  dataView.setFloat32(0, arg0, true);
  return dataView.getInt32(0, true);
}
function $floatFromBits(arg0) {
  var dataView = $fpBitsDataView;
  dataView.setInt32(0, arg0, true);
  return dataView.getFloat32(0, true);
}
function $doubleToBits(arg0) {
  var dataView = $fpBitsDataView;
  return $s_RTLong__fromDoubleBits__D__O__J(arg0, dataView);
}
function $doubleFromBits(arg0) {
  var dataView = $fpBitsDataView;
  return $s_RTLong__bitsToDouble__I__I__O__D(arg0.l, arg0.h, dataView);
}
function $resolveSuperRef(arg0, arg1) {
  var getPrototypeOf = Object.getPrototyeOf;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var superProto = arg0.prototype;
  while ((superProto !== null)) {
    var desc = getOwnPropertyDescriptor(superProto, arg1);
    if ((desc !== (void 0))) {
      return desc;
    }
    superProto = getPrototypeOf(superProto);
  }
}
function $superGet(arg0, arg1, arg2) {
  var desc = $resolveSuperRef(arg0, arg2);
  if ((desc !== (void 0))) {
    var getter = desc.get;
    return ((getter !== (void 0)) ? getter.call(arg1) : getter.value);
  }
}
function $superSet(arg0, arg1, arg2, arg3) {
  var desc = $resolveSuperRef(arg0, arg2);
  if ((desc !== (void 0))) {
    var setter = desc.set;
    if ((setter !== (void 0))) {
      setter.call(arg1, arg3);
      return (void 0);
    }
  }
  throw new TypeError((("super has no setter '" + arg2) + "'."));
}
function $arraycopyGeneric(arg0, arg1, arg2, arg3, arg4) {
  if (((arg0 !== arg2) || (((arg3 - arg1) >>> 0) > (arg4 >>> 0)))) {
    for (var i = 0; (i < arg4); i = ((i + 1) | 0)) {
      arg2[((arg3 + i) | 0)] = arg0[((arg1 + i) | 0)];
    }
  } else {
    for (var i = ((arg4 - 1) | 0); (i >= 0); i = ((i - 1) | 0)) {
      arg2[((arg3 + i) | 0)] = arg0[((arg1 + i) | 0)];
    }
  }
}
var $lastIDHash = 0;
var $idHashCodeMap = new WeakMap();
function $systemIdentityHashCode(obj) {
  switch ((typeof obj)) {
    case "string": {
      return $f_T__hashCode__I(obj);
    }
    case "number": {
      return $f_jl_Double__hashCode__I(obj);
    }
    case "bigint": {
      var biHash = 0;
      if ((obj < BigInt(0))) {
        obj = (~obj);
      }
      while ((obj !== BigInt(0))) {
        biHash = (biHash ^ Number(BigInt.asIntN(32, obj)));
        obj = (obj >> BigInt(32));
      }
      return biHash;
    }
    case "boolean": {
      return (obj ? 1231 : 1237);
    }
    case "undefined": {
      return 0;
    }
    case "symbol": {
      var description = obj.description;
      return ((description === (void 0)) ? 0 : $f_T__hashCode__I(description));
    }
    default: {
      if ((obj === null)) {
        return 0;
      } else {
        var hash = $idHashCodeMap.get(obj);
        if ((hash === (void 0))) {
          hash = (($lastIDHash + 1) | 0);
          $lastIDHash = hash;
          $idHashCodeMap.set(obj, hash);
        }
        return hash;
      }
    }
  }
}
function $isByte(arg0) {
  return ((((typeof arg0) === "number") && (((arg0 << 24) >> 24) === arg0)) && ((1 / arg0) !== (1 / (-0))));
}
function $isShort(arg0) {
  return ((((typeof arg0) === "number") && (((arg0 << 16) >> 16) === arg0)) && ((1 / arg0) !== (1 / (-0))));
}
function $isInt(arg0) {
  return ((((typeof arg0) === "number") && ((arg0 | 0) === arg0)) && ((1 / arg0) !== (1 / (-0))));
}
function $isFloat(arg0) {
  return (((typeof arg0) === "number") && ((arg0 !== arg0) || (Math.fround(arg0) === arg0)));
}
function $bC(arg0) {
  return new $Char(arg0);
}
var $bC0 = $bC(0);
function $bL(arg0, arg1) {
  return new $Long(arg0, arg1);
}
var $bL0 = $bL(0, 0);
function $uC(arg0) {
  return ((arg0 === null) ? 0 : arg0.c);
}
function $uJ(arg0) {
  return ((arg0 === null) ? $bL0 : arg0);
}
function $ct_O__($thiz) {
  return $thiz;
}
/** @constructor */
function $c_O() {
}
$p = $c_O.prototype;
$p.constructor = $c_O;
/** @constructor */
function $h_O() {
}
$h_O.prototype = $p;
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
$p.l = (function(that) {
  return (this === that);
});
$p.p = (function() {
  var i = this.r();
  return (($objectClassName(this) + "@") + (i >>> 0.0).toString(16));
});
$p.toString = (function() {
  return this.p();
});
function $ac_O(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Array(arg);
    for (var i = 0; (i < arg); (i++)) {
      this.a[i] = null;
    }
  } else {
    this.a = arg;
  }
}
$p = $ac_O.prototype = new $h_O();
$p.constructor = $ac_O;
$p.t = (function(srcPos, dest, destPos, length) {
  $arraycopyGeneric(this.a, srcPos, dest.a, destPos, length);
});
$p.e = (function() {
  return new $ac_O(this.a.slice());
});
function $ah_O() {
}
$ah_O.prototype = $p;
function $ac_Z(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Array(arg);
    for (var i = 0; (i < arg); (i++)) {
      this.a[i] = false;
    }
  } else {
    this.a = arg;
  }
}
$p = $ac_Z.prototype = new $h_O();
$p.constructor = $ac_Z;
$p.t = (function(srcPos, dest, destPos, length) {
  $arraycopyGeneric(this.a, srcPos, dest.a, destPos, length);
});
$p.e = (function() {
  return new $ac_Z(this.a.slice());
});
function $ac_C(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Uint16Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_C.prototype = new $h_O();
$p.constructor = $ac_C;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_C(this.a.slice());
});
function $ac_B(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Int8Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_B.prototype = new $h_O();
$p.constructor = $ac_B;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_B(this.a.slice());
});
function $ac_S(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Int16Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_S.prototype = new $h_O();
$p.constructor = $ac_S;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_S(this.a.slice());
});
function $ac_I(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Int32Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_I.prototype = new $h_O();
$p.constructor = $ac_I;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_I(this.a.slice());
});
function $ac_J(arg) {
  if (((typeof arg) === "number")) {
    arg = (arg << 1);
    this.a = new Int32Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_J.prototype = new $h_O();
$p.constructor = $ac_J;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray((srcPos << 1), (((srcPos + length) | 0) << 1)), (destPos << 1));
});
$p.e = (function() {
  return new $ac_J(this.a.slice());
});
function $ac_F(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Float32Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_F.prototype = new $h_O();
$p.constructor = $ac_F;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_F(this.a.slice());
});
function $ac_D(arg) {
  if (((typeof arg) === "number")) {
    this.a = new Float64Array(arg);
  } else {
    this.a = arg;
  }
}
$p = $ac_D.prototype = new $h_O();
$p.constructor = $ac_D;
$p.t = (function(srcPos, dest, destPos, length) {
  dest.a.set(this.a.subarray(srcPos, ((srcPos + length) | 0)), destPos);
});
$p.e = (function() {
  return new $ac_D(this.a.slice());
});
function $TypeData() {
  this.C = (void 0);
  this.n = null;
  this.O = null;
  this.B = null;
  this.D = 0;
  this.z = null;
  this.E = "";
  this.L = (void 0);
  this.A = (void 0);
  this.F = (void 0);
  this.w = (void 0);
  this.J = false;
  this.N = "";
  this.X = false;
  this.Y = false;
  this.Z = false;
  this.I = (void 0);
}
$p = $TypeData.prototype;
$p.p = (function(zero, arrayEncodedName, displayName, arrayClass, typedArrayClass) {
  this.n = ({});
  this.z = zero;
  this.E = arrayEncodedName;
  var self = this;
  this.F = ((that) => (that === self));
  this.N = displayName;
  this.X = true;
  this.I = ((obj) => false);
  if ((arrayClass !== (void 0))) {
    this.A = new $TypeData().y(this, arrayClass, typedArrayClass, (arrayEncodedName === "J"));
  }
  return this;
});
$p.i = (function(kindOrCtor, fullName, ancestors, isInstance) {
  var internalName = Object.getOwnPropertyNames(ancestors)[0];
  this.n = ancestors;
  this.E = (("L" + fullName) + ";");
  this.F = ((that) => (!(!that.n[internalName])));
  this.J = (kindOrCtor === 2);
  this.N = fullName;
  this.Y = (kindOrCtor === 1);
  this.I = (isInstance || ((obj) => (!(!((obj && obj.$classData) && obj.$classData.n[internalName])))));
  if (((typeof kindOrCtor) !== "number")) {
    kindOrCtor.prototype.$classData = this;
  }
  return this;
});
$p.y = (function(componentData, arrayClass, typedArrayClass, isLongArray, isAssignableFromFun) {
  arrayClass.prototype.$classData = this;
  var name = ("[" + componentData.E);
  this.C = arrayClass;
  this.n = ({
    C: 1,
    a: 1
  });
  this.O = componentData;
  this.B = componentData;
  this.D = 1;
  this.E = name;
  this.N = name;
  this.Z = true;
  var self = this;
  this.F = (isAssignableFromFun || ((that) => (self === that)));
  this.w = (isLongArray ? ((array) => {
    var len = (array.length | 0);
    var result = new arrayClass(len);
    var u = result.a;
    for (var i = 0; (i < len); i = ((i + 1) | 0)) {
      var srcElem = array[i];
      u[(i << 1)] = srcElem.l;
      u[(((i << 1) + 1) | 0)] = srcElem.h;
    }
    return result;
  }) : (typedArrayClass ? ((array) => new arrayClass(new typedArrayClass(array))) : ((array) => new arrayClass(array))));
  this.I = ((obj) => (obj instanceof arrayClass));
  return this;
});
$p.a = (function(componentData) {
  function ArrayClass(arg) {
    if (((typeof arg) === "number")) {
      this.a = new Array(arg);
      for (var i = 0; (i < arg); (i++)) {
        this.a[i] = null;
      }
    } else {
      this.a = arg;
    }
  }
  var $p = ArrayClass.prototype = new $ah_O();
  $p.constructor = ArrayClass;
  $p.t = (function(srcPos, dest, destPos, length) {
    $arraycopyGeneric(this.a, srcPos, dest.a, destPos, length);
  });
  $p.e = (function() {
    return new ArrayClass(this.a.slice());
  });
  $p.$classData = this;
  var arrayBase = (componentData.B || componentData);
  var arrayDepth = (componentData.D + 1);
  var name = ("[" + componentData.E);
  this.C = ArrayClass;
  this.n = ({
    C: 1,
    a: 1
  });
  this.O = componentData;
  this.B = arrayBase;
  this.D = arrayDepth;
  this.E = name;
  this.N = name;
  this.Z = true;
  var isAssignableFromFun = ((that) => {
    var thatDepth = that.D;
    return ((thatDepth === arrayDepth) ? arrayBase.F(that.B) : ((thatDepth > arrayDepth) && (arrayBase === $d_O)));
  });
  this.F = isAssignableFromFun;
  this.w = ((array) => new ArrayClass(array));
  var self = this;
  this.I = ((obj) => {
    var data = (obj && obj.$classData);
    return ((!(!data)) && ((data === self) || isAssignableFromFun(data)));
  });
  return this;
});
$p.r = (function() {
  if ((!this.A)) {
    this.A = new $TypeData().a(this);
  }
  return this.A;
});
$p.l = (function() {
  if ((!this.L)) {
    this.L = new $c_jl_Class(this);
  }
  return this.L;
});
$p.R = (function(that) {
  return ((this === that) || this.F(that));
});
$p.S = (function() {
  return (this.P ? this.P.l() : null);
});
$p.Q = (function() {
  return (this.O ? this.O.l() : null);
});
$p.U = (function(length) {
  if ((this === $d_V)) {
    throw $ct_jl_IllegalArgumentException__(new $c_jl_IllegalArgumentException());
  }
  return new (this.r().C)(length);
});
function $isArrayOf_O(obj, depth) {
  var data = (obj && obj.$classData);
  if ((!data)) {
    return false;
  } else {
    var arrayDepth = data.D;
    return ((arrayDepth === depth) ? (!data.B.X) : (arrayDepth > depth));
  }
}
function $isArrayOf_Z(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_Z))));
}
function $isArrayOf_C(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_C))));
}
function $isArrayOf_B(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_B))));
}
function $isArrayOf_S(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_S))));
}
function $isArrayOf_I(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_I))));
}
function $isArrayOf_J(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_J))));
}
function $isArrayOf_F(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_F))));
}
function $isArrayOf_D(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && (obj.$classData.B === $d_D))));
}
var $d_O = new $TypeData();
$d_O.n = ({});
$d_O.E = "Ljava.lang.Object;";
$d_O.F = ((that) => (!that.X));
$d_O.N = "java.lang.Object";
$d_O.I = ((obj) => (obj !== null));
$d_O.A = new $TypeData().y($d_O, $ac_O, (void 0), false, ((that) => {
  var thatDepth = that.D;
  return ((thatDepth === 1) ? (!that.B.X) : (thatDepth > 1));
}));
$c_O.prototype.$classData = $d_O;
var $d_V = new $TypeData().p((void 0), "V", "void", (void 0), (void 0));
var $d_Z = new $TypeData().p(false, "Z", "boolean", $ac_Z, (void 0));
var $d_C = new $TypeData().p(0, "C", "char", $ac_C, Uint16Array);
var $d_B = new $TypeData().p(0, "B", "byte", $ac_B, Int8Array);
var $d_S = new $TypeData().p(0, "S", "short", $ac_S, Int16Array);
var $d_I = new $TypeData().p(0, "I", "int", $ac_I, Int32Array);
var $d_J = new $TypeData().p($bL0, "J", "long", $ac_J, Int32Array);
var $d_F = new $TypeData().p(0.0, "F", "float", $ac_F, Float32Array);
var $d_D = new $TypeData().p(0.0, "D", "double", $ac_D, Float64Array);
var $typedArraysAreBigEndian = (new Int8Array(new Int32Array([1]).buffer)[0] === 0);
function $constArrayBuffer_B(len, encoded) {
  var buf = new ArrayBuffer(len);
  var view = new DataView(buf);
  var regularChunksEnd = ((encoded.length - 4) | 0);
  var i = 0;
  var j = 0;
  var chunk = 0;
  while (true) {
    chunk = (((encoded.charCodeAt(i) | (encoded.charCodeAt(((i + 1) | 0)) << 8)) | (encoded.charCodeAt(((i + 2) | 0)) << 16)) | (encoded.charCodeAt(((i + 3) | 0)) << 24));
    chunk = ((((chunk - 808464432) | 0) - ((chunk & 1616928864) >>> 3)) | 0);
    chunk = (((chunk & 1056980736) >>> 2) | (chunk & 4128831));
    chunk = (((chunk & 268369920) >>> 4) | (chunk & 4095));
    if ((i === regularChunksEnd)) {
      break;
    }
    view.setUint32(j, chunk, true);
    i = ((i + 4) | 0);
    j = ((j + 3) | 0);
  }
  var trailing = ((len - j) | 0);
  view.setUint8(j, chunk);
  if ((trailing !== 1)) {
    view.setUint8(((j + 1) | 0), (chunk >>> 8));
    if ((trailing === 3)) {
      view.setUint8(((j + 2) | 0), (chunk >>> 16));
    }
  }
  return buf;
}
function $constArrayBuffer_S(len, encoded) {
  var buf = $constArrayBuffer_B((len << 1), encoded);
  if ($typedArraysAreBigEndian) {
    var view = new DataView(buf);
    var i = 0;
    while ((i !== len)) {
      view.putInt16(i, view.getInt16(i, true), false);
      i = ((i + 2) | 0);
    }
  }
  return buf;
}
function $constArrayBuffer_I(len, encoded) {
  var buf = $constArrayBuffer_B((len << 2), encoded);
  if ($typedArraysAreBigEndian) {
    var view = new DataView(buf);
    var i = 0;
    while ((i !== len)) {
      view.putInt32(i, view.getInt32(i, true), false);
      i = ((i + 4) | 0);
    }
  }
  return buf;
}
function $constArrayBuffer_J(len, encoded) {
  return $constArrayBuffer_I((len << 1), encoded);
}
function $constTypedArrayU_I(len, encoded, prevMask) {
  var buf = new Int32Array(len);
  var inLen = (encoded.length | 0);
  var prev = 0;
  var i = 0;
  var j = 0;
  var v = 0;
  while ((i !== inLen)) {
    var c = encoded.charCodeAt(i);
    if ((c < 80)) {
      v = ((v | (c - 48)) << 5);
    } else {
      v = (v | (c - 93));
      prev = (((prev & prevMask) + v) | 0);
      buf[j] = prev;
      j = ((j + 1) | 0);
      v = 0;
    }
    i = ((i + 1) | 0);
  }
  return buf;
}
function $constTypedArrayS_I(len, encoded, prevMask) {
  var buf = new Int32Array(len);
  var inLen = (encoded.length | 0);
  var prev = 0;
  var i = 0;
  var j = 0;
  var v = 0;
  var first = true;
  while ((i !== inLen)) {
    var c = encoded.charCodeAt(i);
    if ((c < 80)) {
      if (first) {
        v = (((c - 48) << 27) >> 22);
        first = false;
      } else {
        v = ((v | (c - 48)) << 5);
      }
    } else {
      if (first) {
        v = (((c - 93) << 27) >> 27);
      } else {
        v = (v | (c - 93));
        first = true;
      }
      prev = (((prev & prevMask) + v) | 0);
      buf[j] = prev;
      j = ((j + 1) | 0);
    }
    i = ((i + 1) | 0);
  }
  return buf;
}
function $constArrRaw_B(len, encoded) {
  return new $ac_B(new Int8Array($constArrayBuffer_B(len, encoded)));
}
function $constArrRaw_S(len, encoded) {
  return new $ac_S(new Int16Array($constArrayBuffer_S(len, encoded)));
}
function $constArrRaw_C(len, encoded) {
  return new $ac_C(new Uint16Array($constArrayBuffer_S(len, encoded)));
}
function $constArrRaw_I(len, encoded) {
  return new $ac_I(new Int32Array($constArrayBuffer_I(len, encoded)));
}
function $constArrRaw_J(len, encoded) {
  return new $ac_J(new Int32Array($constArrayBuffer_J(len, encoded)));
}
function $constArrUVals_I(len, encoded) {
  return new $ac_I($constTypedArrayU_I(len, encoded, 0));
}
function $constArrUDiffs_I(len, encoded) {
  return new $ac_I($constTypedArrayU_I(len, encoded, (-1)));
}
function $constArrSVals_I(len, encoded) {
  return new $ac_I($constTypedArrayS_I(len, encoded, 0));
}
function $constArrSDiffs_I(len, encoded) {
  return new $ac_I($constTypedArrayS_I(len, encoded, (-1)));
}
function $constArrUVals_J(len, encoded) {
  return new $ac_J($constTypedArrayU_I((len << 1), encoded, 0));
}
function $constArrUDiffs_J(len, encoded) {
  return new $ac_J($constTypedArrayU_I((len << 1), encoded, (-1)));
}
function $constArrSVals_J(len, encoded) {
  return new $ac_J($constTypedArrayS_I((len << 1), encoded, 0));
}
function $constArrSDiffs_J(len, encoded) {
  return new $ac_J($constTypedArrayS_I((len << 1), encoded, (-1)));
}
function $p_Lapothecary_App$__stir$1__Lcom_raquo_airstream_state_Var__V($thiz, amount) {
  $f_Lcom_raquo_airstream_state_Var__update__F1__V(amount, new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((a$3) => {
    var a$2 = (a$3 | 0);
    var x = ((5 + a$2) | 0);
    return ((x < 100) ? x : 100);
  })));
}
/** @constructor */
function $c_Lapothecary_App$() {
}
$p = $c_Lapothecary_App$.prototype = new $h_O();
$p.constructor = $c_Lapothecary_App$;
/** @constructor */
function $h_Lapothecary_App$() {
}
$h_Lapothecary_App$.prototype = $p;
$p.re = (function() {
  var moonwater = $m_Lcom_raquo_laminar_api_package$().w.fd.gS(40);
  var nightshade = $m_Lcom_raquo_laminar_api_package$().w.fd.gS(20);
  var fireSalt = $m_Lcom_raquo_laminar_api_package$().w.fd.gS(10);
  var colour = new $c_Lcom_raquo_airstream_misc_MapSignal($m_Lcom_raquo_airstream_combine_generated_CombinableSignal$().oP(moonwater.cf, nightshade.cf, fireSalt.cf, new $c_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5()), new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$1$2) => $m_Lapothecary_Mix$().oM((x$1$2.eA | 0), (x$1$2.eB | 0), (x$1$2.eC | 0)))), $m_s_None$());
  return $m_Lcom_raquo_laminar_api_package$().w.fY().bx(new $c_sjsr_WrappedVarArgs([$m_Lcom_raquo_laminar_api_package$().w.dQ.eN("card"), $m_Lcom_raquo_laminar_api_package$().w.pG().bx(new $c_sjsr_WrappedVarArgs([$f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($m_Lcom_raquo_laminar_api_package$().w, "The cauldron", $m_Lcom_raquo_laminar_modifiers_RenderableText$().es)])), this.jq("Moonwater", moonwater), this.jq("Nightshade", nightshade), this.jq("Fire salt", fireSalt), $m_Lcom_raquo_laminar_api_package$().w.fY().bx(new $c_sjsr_WrappedVarArgs([$m_Lcom_raquo_laminar_api_package$().w.dQ.eN("row"), $m_Lcom_raquo_laminar_api_package$().w.fY().bx(new $c_sjsr_WrappedVarArgs([$m_Lcom_raquo_laminar_api_package$().w.dQ.eN("cauldron"), $m_Lcom_raquo_laminar_api_package$().w.oC().ob(colour, $m_s_$less$colon$less$().ex)])), ($m_Lcom_raquo_laminar_api_package$(), $m_Lcom_raquo_laminar_receivers_ChildOptionReceiver$()).oc(new $c_Lcom_raquo_airstream_misc_MapSignal(fireSalt.cf, new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((f$3) => (((f$3 | 0) > 80) ? new $c_s_Some($m_Lcom_raquo_laminar_api_package$().w.jr().bx(new $c_sjsr_WrappedVarArgs([$m_Lcom_raquo_laminar_api_package$().w.dQ.eN("cauldron-warning"), $f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($m_Lcom_raquo_laminar_api_package$().w, "It's going to blow! \ud83d\udca5", $m_Lcom_raquo_laminar_modifiers_RenderableText$().es)]))) : $m_s_None$()))), $m_s_None$()))])), $m_Lcom_raquo_laminar_api_package$().w.oI().bx(new $c_sjsr_WrappedVarArgs([$f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($m_Lcom_raquo_laminar_api_package$().w, "Stir \ud83e\udd44", $m_Lcom_raquo_laminar_modifiers_RenderableText$().es), new $c_Lcom_raquo_laminar_modifiers_EventListener(($m_Lcom_raquo_laminar_api_package$(), $m_Lcom_raquo_laminar_keys_EventProcessor$().mT($m_Lcom_raquo_laminar_api_package$().w.nl(), false, false)), new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((_$1$3) => {
    var this$27 = new $c_sci_$colon$colon(moonwater, new $c_sci_$colon$colon(nightshade, new $c_sci_$colon$colon(fireSalt, $m_sci_Nil$())));
    var these = this$27;
    while ((!these.c())) {
      $p_Lapothecary_App$__stir$1__Lcom_raquo_airstream_state_Var__V(this, these.o());
      these = these.s();
    }
  })))]))]));
});
$p.jq = (function(label, amount) {
  var $x_7 = $m_Lcom_raquo_laminar_api_package$().w.fY();
  var $x_6 = $m_Lcom_raquo_laminar_api_package$().w.dQ.eN("slider-row");
  var $x_5 = $m_Lcom_raquo_laminar_api_package$().w.jr().bx(new $c_sjsr_WrappedVarArgs([$f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($m_Lcom_raquo_laminar_api_package$().w, label, $m_Lcom_raquo_laminar_modifiers_RenderableText$().es)]));
  var $x_4 = $m_Lcom_raquo_laminar_api_package$().w.pP();
  var $x_3 = $m_Lcom_raquo_laminar_api_package$().w.nI().iz("range");
  var $x_2 = $m_Lcom_raquo_laminar_api_package$().w.qi().iz("0");
  var $x_1 = $m_Lcom_raquo_laminar_api_package$().w.qf().iz("100");
  $m_Lcom_raquo_laminar_api_package$();
  var updater = $m_Lcom_raquo_laminar_api_package$().w.jv().od(new $c_Lcom_raquo_airstream_misc_MapSignal(amount.cf, new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((_$2$3) => ("" + (_$2$3 | 0)))), $m_s_None$()));
  var listener = new $c_Lcom_raquo_laminar_modifiers_EventListener(($m_Lcom_raquo_laminar_api_package$(), $m_Lcom_raquo_laminar_keys_EventProcessor$().mT($m_Lcom_raquo_laminar_api_package$().w.h8(), false, false)).qe().q7(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((_$3$2) => {
    var this$12 = ($m_sc_StringOps$(), $m_sc_StringParsers$().qv(_$3$2));
    return ((this$12.c() ? 0 : this$12.y()) | 0);
  }))), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => {
    amount.hz.eV(_$1);
  })));
  return $x_7.bx(new $c_sjsr_WrappedVarArgs([$x_6, $x_5, $x_4.bx(new $c_sjsr_WrappedVarArgs([$x_3, $x_2, $x_1, $m_Lcom_raquo_laminar_inputs_InputController$().oT(listener, updater)])), $m_Lcom_raquo_laminar_api_package$().w.jr().bx(new $c_sjsr_WrappedVarArgs([($m_Lcom_raquo_laminar_api_package$(), $m_Lcom_raquo_laminar_receivers_ChildTextReceiver$()).oa(amount.cf, $m_Lcom_raquo_laminar_modifiers_RenderableText$().lf)]))]));
});
var $d_Lapothecary_App$ = new $TypeData().i($c_Lapothecary_App$, "apothecary.App$", ({
  ck: 1
}));
var $n_Lapothecary_App$;
function $m_Lapothecary_App$() {
  if ((!$n_Lapothecary_App$)) {
    $n_Lapothecary_App$ = new $c_Lapothecary_App$();
  }
  return $n_Lapothecary_App$;
}
function $s_Lapothecary_Main__main__AT__V(args) {
  $m_Lnotebook_plugin_NotebookPlugin$().pU($m_Lapothecary_Main$());
}
function $p_Lapothecary_Mix$__channel$1__I__I__I__D__I__I__I__D($thiz, moonwater$1, nightshade$1, fireSalt$1, total$1, blue, magenta, yellow) {
  return (((((Math.imul(moonwater$1, blue) + Math.imul(nightshade$1, magenta)) | 0) + Math.imul(fireSalt$1, yellow)) | 0) / total$1);
}
/** @constructor */
function $c_Lapothecary_Mix$() {
}
$p = $c_Lapothecary_Mix$.prototype = new $h_O();
$p.constructor = $c_Lapothecary_Mix$;
/** @constructor */
function $h_Lapothecary_Mix$() {
}
$h_Lapothecary_Mix$.prototype = $p;
$p.oM = (function(moonwater, nightshade, fireSalt) {
  var total = ((((moonwater + nightshade) | 0) + fireSalt) | 0);
  if ((total === 0.0)) {
    return "hsl(60, 8%, 30%)";
  } else {
    var r = $p_Lapothecary_Mix$__channel$1__I__I__I__D__I__I__I__D(this, moonwater, nightshade, fireSalt, total, 0, 200, 255);
    var g = $p_Lapothecary_Mix$__channel$1__I__I__I__D__I__I__I__D(this, moonwater, nightshade, fireSalt, total, 110, 0, 200);
    var b = $p_Lapothecary_Mix$__channel$1__I__I__I__D__I__I__I__D(this, moonwater, nightshade, fireSalt, total, 255, 255, 0);
    var x = (+Math.max(r, g));
    var max = (+Math.max(x, b));
    var x$1 = (+Math.min(r, g));
    var min = (+Math.min(x$1, b));
    var chroma = (max - min);
    var hue = ((chroma === 0.0) ? 0.0 : ((max === r) ? (60.0 * (((g - b) / chroma) % 6.0)) : ((max === g) ? (60.0 * (((b - r) / chroma) + 2.0)) : (60.0 * (((r - g) / chroma) + 4.0)))));
    var saturation = (45.0 + ((45.0 * chroma) / 255.0));
    var lightness = (0.64 + ((0.2 * total) / 300.0));
    return $m_sc_StringOps$().po("oklch(from hsl(%.0f %.0f%% 50%%) %.2f c h)", $m_sr_ScalaRunTime$().n8(new $ac_O([((hue + 360.0) % 360.0), saturation, lightness])));
  }
});
var $d_Lapothecary_Mix$ = new $TypeData().i($c_Lapothecary_Mix$, "apothecary.Mix$", ({
  cm: 1
}));
var $n_Lapothecary_Mix$;
function $m_Lapothecary_Mix$() {
  if ((!$n_Lapothecary_Mix$)) {
    $n_Lapothecary_Mix$ = new $c_Lapothecary_Mix$();
  }
  return $n_Lapothecary_Mix$;
}
/** @constructor */
function $c_Lapothecary_Shop$() {
}
$p = $c_Lapothecary_Shop$.prototype = new $h_O();
$p.constructor = $c_Lapothecary_Shop$;
/** @constructor */
function $h_Lapothecary_Shop$() {
}
$h_Lapothecary_Shop$.prototype = $p;
$p.bx = (function(content) {
  return $m_Lcom_raquo_laminar_api_package$().w.fY().bx(new $c_sjsr_WrappedVarArgs([$m_Lcom_raquo_laminar_api_package$().w.dQ.eN("apothecary-app"), $m_Lcom_raquo_laminar_api_package$().w.qX().bx(new $c_sjsr_WrappedVarArgs([$f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($m_Lcom_raquo_laminar_api_package$().w, "\n.apothecary-app {\n  --ink:#2b1d3a; --muted:#6c6278; --potion:#6b3fa0; --elixir:#2f8f6f; --brass:#c08a2e; --rude:#b3261e;\n  --paper:#fbf8f2; --rule:#ddd3c4;\n  font:var(--apothecary-font-size, 16px)/1.45 system-ui, -apple-system, \"Segoe UI\", sans-serif; color:var(--ink); text-align:left;\n  display:flex; flex-direction:column; gap:1em;\n}\n.apothecary-app * { box-sizing:border-box; }\n.apothecary-app h2 { margin:0; font-size:1.3em; }\n.apothecary-app button {\n  font:inherit; padding:.35em .8em; border-radius:.4em; border:1px solid var(--potion);\n  background:var(--potion); color:#fff; cursor:pointer; white-space:nowrap;\n}\n.apothecary-app button.quiet { background:transparent; color:var(--potion); }\n.apothecary-app button:disabled { opacity:.45; cursor:not-allowed; }\n.apothecary-app input[type=text], .apothecary-app input[type=number], .apothecary-app input[type=search] {\n  font:inherit; padding:.35em .5em; border:1px solid var(--rule); border-radius:.35em; background:#fff; min-width:0;\n}\n.apothecary-app .card { background:var(--paper); border:1px solid var(--rule); border-radius:.6em; padding:1em; }\n.apothecary-app .row { display:flex; gap:.75em; align-items:center; flex-wrap:wrap; }\n\n/* 01 \u00b7 cauldron */\n.apothecary-app .slider-row { display:grid; grid-template-columns:8em 1fr 3em; gap:.5em; align-items:center; }\n.apothecary-app .cauldron {\n  width:9em; height:6em; border-radius:0 0 4.5em 4.5em; border:6px solid #2b2b2b; border-top-width:10px;\n  transition:background-color .3s; box-shadow:inset 0 -12px 18px #0004;\n}\n.apothecary-app .cauldron-warning { color:var(--rude); font-weight:600; }\n\n/* 02 \u00b7 forms */\n.apothecary-app form { display:flex; flex-direction:column; gap:.8em; }\n.apothecary-app .field { display:flex; flex-direction:column; gap:.25em; }\n.apothecary-app .field > label { font-weight:600; }\n.apothecary-app .field.invalid input { border-color:var(--rude); }\n.apothecary-app .field-error { color:var(--rude); font-size:.9em; }\n.apothecary-app .checks { display:flex; flex-wrap:wrap; gap:.3em 1em; }\n.apothecary-app .problems { color:var(--rude); margin:0; padding-left:1.2em; }\n.apothecary-app .success { color:var(--elixir); font-weight:600; }\n\n/* 03 \u00b7 async */\n.apothecary-app .thinking { color:var(--muted); font-style:italic; }\n.apothecary-app .rude { color:var(--rude); }\n.apothecary-app ul.results, .apothecary-app ul.shelves { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.3em; }\n.apothecary-app .results li { display:flex; gap:.5em; align-items:baseline; }\n.apothecary-app .results li > :not(.note) { flex:none; }\n.apothecary-app .rarity { font-size:.75em; padding:0 .4em; border-radius:.3em; background:var(--rule); white-space:nowrap; }\n.apothecary-app .rarity.Legendary { background:var(--brass); color:#fff; }\n.apothecary-app .note { color:var(--muted); font-size:.9em; }\n.apothecary-app .shelf { display:grid; grid-template-columns:1fr auto auto auto auto; gap:.5em; align-items:center; }\n.apothecary-app .shelf.saving { opacity:.55; }\n.apothecary-app .quantity { min-width:2.5em; text-align:center; font-variant-numeric:tabular-nums; }\n\n/* 04 \u00b7 brew */\n.apothecary-app .shake { animation:apothecary-shake .5s; }\n@keyframes apothecary-shake {\n  0%, 100% { transform:none; } 20% { transform:translate(-8px, 2px); } 40% { transform:translate(8px, -2px); }\n  60% { transform:translate(-6px, 1px); } 80% { transform:translate(6px, -1px); }\n}\n\n/* the oracle's control panel */\n.apothecary-app .oracle-panel {\n  display:flex; flex-wrap:wrap; gap:.4em 1.2em; align-items:center; font-size:.85em; color:var(--muted);\n  border:1px dashed var(--rule); border-radius:.5em; padding:.4em .7em;\n}\n.apothecary-app .oracle-panel label { display:flex; gap:.4em; align-items:center; }\n.apothecary-app .oracle-title { font-weight:600; color:var(--ink); }\n.apothecary-app .oracle-busy.active { color:var(--potion); }\n", $m_Lcom_raquo_laminar_modifiers_RenderableText$().es)])), $f_Lcom_raquo_laminar_api_Implicits__seqToModifier__O__F1__Lcom_raquo_laminar_modifiers_RenderableSeq__Lcom_raquo_laminar_modifiers_Modifier($m_Lcom_raquo_laminar_api_package$().w, content, $m_s_$less$colon$less$().ex, $m_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$())]));
});
var $d_Lapothecary_Shop$ = new $TypeData().i($c_Lapothecary_Shop$, "apothecary.Shop$", ({
  cn: 1
}));
var $n_Lapothecary_Shop$;
function $m_Lapothecary_Shop$() {
  if ((!$n_Lapothecary_Shop$)) {
    $n_Lapothecary_Shop$ = new $c_Lapothecary_Shop$();
  }
  return $n_Lapothecary_Shop$;
}
/** @constructor */
function $c_Lapp_tulz_tuplez_Composition() {
}
$p = $c_Lapp_tulz_tuplez_Composition.prototype = new $h_O();
$p.constructor = $c_Lapp_tulz_tuplez_Composition;
/** @constructor */
function $h_Lapp_tulz_tuplez_Composition() {
}
$h_Lapp_tulz_tuplez_Composition.prototype = $p;
/** @constructor */
function $c_Lcom_raquo_airstream_combine_CombineObservable$() {
}
$p = $c_Lcom_raquo_airstream_combine_CombineObservable$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_combine_CombineObservable$;
/** @constructor */
function $h_Lcom_raquo_airstream_combine_CombineObservable$() {
}
$h_Lcom_raquo_airstream_combine_CombineObservable$.prototype = $p;
$p.q3 = (function(trys, combinator) {
  var elem = false;
  elem = true;
  var i = 0;
  var len = (trys.length | 0);
  while ((i < len)) {
    if (trys[i].ja()) {
      var ev$6 = false;
      elem = ev$6;
    }
    i = ((1 + i) | 0);
  }
  if (elem) {
    var values = trys.map(((_$3) => _$3.y()));
    return new $c_s_util_Success(combinator.b(values));
  } else {
    var arr = trys.map(((x$1) => ((x$1 instanceof $c_s_util_Failure) ? new $c_s_Some(x$1.dw) : $m_s_None$())));
    return new $c_s_util_Failure(new $c_Lcom_raquo_airstream_core_AirstreamError$CombinedError($m_sci_IndexedSeq$().iW($ct_sjs_js_WrappedArray__sjs_js_Array__(new $c_sjs_js_WrappedArray(), arr))));
  }
});
var $d_Lcom_raquo_airstream_combine_CombineObservable$ = new $TypeData().i($c_Lcom_raquo_airstream_combine_CombineObservable$, "com.raquo.airstream.combine.CombineObservable$", ({
  cr: 1
}));
var $n_Lcom_raquo_airstream_combine_CombineObservable$;
function $m_Lcom_raquo_airstream_combine_CombineObservable$() {
  if ((!$n_Lcom_raquo_airstream_combine_CombineObservable$)) {
    $n_Lcom_raquo_airstream_combine_CombineObservable$ = new $c_Lcom_raquo_airstream_combine_CombineObservable$();
  }
  return $n_Lcom_raquo_airstream_combine_CombineObservable$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_combine_generated_CombinableSignal$() {
}
$p = $c_Lcom_raquo_airstream_combine_generated_CombinableSignal$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_combine_generated_CombinableSignal$;
/** @constructor */
function $h_Lcom_raquo_airstream_combine_generated_CombinableSignal$() {
}
$h_Lcom_raquo_airstream_combine_generated_CombinableSignal$.prototype = $p;
$p.oP = (function(this$, s1, s2, c) {
  return $m_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$().oQ(this$, s1, s2, new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((a, v1, v2) => new $c_T3(a, v1, v2))));
});
var $d_Lcom_raquo_airstream_combine_generated_CombinableSignal$ = new $TypeData().i($c_Lcom_raquo_airstream_combine_generated_CombinableSignal$, "com.raquo.airstream.combine.generated.CombinableSignal$", ({
  ct: 1
}));
var $n_Lcom_raquo_airstream_combine_generated_CombinableSignal$;
function $m_Lcom_raquo_airstream_combine_generated_CombinableSignal$() {
  if ((!$n_Lcom_raquo_airstream_combine_generated_CombinableSignal$)) {
    $n_Lcom_raquo_airstream_combine_generated_CombinableSignal$ = new $c_Lcom_raquo_airstream_combine_generated_CombinableSignal$();
  }
  return $n_Lcom_raquo_airstream_combine_generated_CombinableSignal$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$() {
}
$p = $c_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$;
/** @constructor */
function $h_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$() {
}
$h_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$.prototype = $p;
$p.oQ = (function(s1, s2, s3, combinator) {
  return new $c_Lcom_raquo_airstream_combine_CombineSignalN($m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Signal.r().C)([s1.cd(), s2.cd(), s3.cd()]))), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((arr) => combinator.gR(arr[0], arr[1], arr[2]))));
});
var $d_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$ = new $TypeData().i($c_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$, "com.raquo.airstream.combine.generated.StaticSignalCombineOps$", ({
  cu: 1
}));
var $n_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$;
function $m_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$() {
  if ((!$n_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$)) {
    $n_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$ = new $c_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$();
  }
  return $n_Lcom_raquo_airstream_combine_generated_StaticSignalCombineOps$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_common_InternalParentObserver$() {
}
$p = $c_Lcom_raquo_airstream_common_InternalParentObserver$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_common_InternalParentObserver$;
/** @constructor */
function $h_Lcom_raquo_airstream_common_InternalParentObserver$() {
}
$h_Lcom_raquo_airstream_common_InternalParentObserver$.prototype = $p;
$p.pv = (function(parent, onTry) {
  return new $c_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2(parent, onTry, this);
});
var $d_Lcom_raquo_airstream_common_InternalParentObserver$ = new $TypeData().i($c_Lcom_raquo_airstream_common_InternalParentObserver$, "com.raquo.airstream.common.InternalParentObserver$", ({
  cw: 1
}));
var $n_Lcom_raquo_airstream_common_InternalParentObserver$;
function $m_Lcom_raquo_airstream_common_InternalParentObserver$() {
  if ((!$n_Lcom_raquo_airstream_common_InternalParentObserver$)) {
    $n_Lcom_raquo_airstream_common_InternalParentObserver$ = new $c_Lcom_raquo_airstream_common_InternalParentObserver$();
  }
  return $n_Lcom_raquo_airstream_common_InternalParentObserver$;
}
var $d_Lcom_raquo_airstream_core_InternalObserver = new $TypeData().i(1, "com.raquo.airstream.core.InternalObserver", ({
  aD: 1
}));
function $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T($thiz) {
  return (($objectGetClass($thiz).j3() + "@") + $thiz.r());
}
function $f_Lcom_raquo_airstream_core_Named__displayName__T($thiz) {
  var x = $thiz.eg();
  return ((x === (void 0)) ? $thiz.ea() : x);
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Observer$() {
  $n_Lcom_raquo_airstream_core_Observer$ = this;
  $m_Lcom_raquo_airstream_core_Observer$().he(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => (void 0))), $m_s_PartialFunction$().ey, true);
}
$p = $c_Lcom_raquo_airstream_core_Observer$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Observer$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Observer$() {
}
$h_Lcom_raquo_airstream_core_Observer$.prototype = $p;
$p.he = (function(onNext, onError, handleObserverErrors) {
  return new $c_Lcom_raquo_airstream_core_Observer$$anon$8(onNext, handleObserverErrors, onError, this);
});
$p.pw = (function(onTry, handleObserverErrors) {
  return new $c_Lcom_raquo_airstream_core_Observer$$anon$9(onTry, handleObserverErrors, this);
});
var $d_Lcom_raquo_airstream_core_Observer$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Observer$, "com.raquo.airstream.core.Observer$", ({
  cB: 1
}));
var $n_Lcom_raquo_airstream_core_Observer$;
function $m_Lcom_raquo_airstream_core_Observer$() {
  if ((!$n_Lcom_raquo_airstream_core_Observer$)) {
    $n_Lcom_raquo_airstream_core_Observer$ = new $c_Lcom_raquo_airstream_core_Observer$();
  }
  return $n_Lcom_raquo_airstream_core_Observer$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_ObserverList$() {
}
$p = $c_Lcom_raquo_airstream_core_ObserverList$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_ObserverList$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_ObserverList$() {
}
$h_Lcom_raquo_airstream_core_ObserverList$.prototype = $p;
$p.ns = (function(this$, observer) {
  var index = (this$.indexOf(observer) | 0);
  var shouldRemove = (index !== (-1));
  if (shouldRemove) {
    this$.splice(index, 1);
  }
  return shouldRemove;
});
var $d_Lcom_raquo_airstream_core_ObserverList$ = new $TypeData().i($c_Lcom_raquo_airstream_core_ObserverList$, "com.raquo.airstream.core.ObserverList$", ({
  cF: 1
}));
var $n_Lcom_raquo_airstream_core_ObserverList$;
function $m_Lcom_raquo_airstream_core_ObserverList$() {
  if ((!$n_Lcom_raquo_airstream_core_ObserverList$)) {
    $n_Lcom_raquo_airstream_core_ObserverList$ = new $c_Lcom_raquo_airstream_core_ObserverList$();
  }
  return $n_Lcom_raquo_airstream_core_ObserverList$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Protected() {
}
$p = $c_Lcom_raquo_airstream_core_Protected.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Protected;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Protected() {
}
$h_Lcom_raquo_airstream_core_Protected.prototype = $p;
var $d_Lcom_raquo_airstream_core_Protected = new $TypeData().i($c_Lcom_raquo_airstream_core_Protected, "com.raquo.airstream.core.Protected", ({
  cG: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_core_Protected$() {
  this.nL = null;
  $n_Lcom_raquo_airstream_core_Protected$ = this;
  this.nL = new $c_Lcom_raquo_airstream_core_Protected();
}
$p = $c_Lcom_raquo_airstream_core_Protected$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Protected$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Protected$() {
}
$h_Lcom_raquo_airstream_core_Protected$.prototype = $p;
$p.qg = (function(minRank, observables) {
  var elem = 0;
  elem = minRank;
  var i = 0;
  var len = (observables.length | 0);
  while ((i < len)) {
    var observable = observables[i];
    var rank = observable.hc();
    if ((rank > elem)) {
      var ev$2 = rank;
      elem = ev$2;
    }
    i = ((1 + i) | 0);
  }
  return elem;
});
var $d_Lcom_raquo_airstream_core_Protected$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Protected$, "com.raquo.airstream.core.Protected$", ({
  cH: 1
}));
var $n_Lcom_raquo_airstream_core_Protected$;
function $m_Lcom_raquo_airstream_core_Protected$() {
  if ((!$n_Lcom_raquo_airstream_core_Protected$)) {
    $n_Lcom_raquo_airstream_core_Protected$ = new $c_Lcom_raquo_airstream_core_Protected$();
  }
  return $n_Lcom_raquo_airstream_core_Protected$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Signal$() {
  this.en = 0;
  this.en = 0;
}
$p = $c_Lcom_raquo_airstream_core_Signal$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Signal$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Signal$() {
}
$h_Lcom_raquo_airstream_core_Signal$.prototype = $p;
$p.ni = (function() {
  if ((this.en === 2147483647)) {
    this.en = 1;
  } else {
    this.en = ((1 + this.en) | 0);
  }
  return this.en;
});
var $d_Lcom_raquo_airstream_core_Signal$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Signal$, "com.raquo.airstream.core.Signal$", ({
  cI: 1
}));
var $n_Lcom_raquo_airstream_core_Signal$;
function $m_Lcom_raquo_airstream_core_Signal$() {
  if ((!$n_Lcom_raquo_airstream_core_Signal$)) {
    $n_Lcom_raquo_airstream_core_Signal$ = new $c_Lcom_raquo_airstream_core_Signal$();
  }
  return $n_Lcom_raquo_airstream_core_Signal$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Transaction(code) {
  this.ho = null;
  this.fc = null;
  this.hp = 0;
  this.ho = code;
  this.fc = (void 0);
  var x = $m_Lcom_raquo_airstream_core_Transaction$pendingTransactions$().g8();
  this.hp = ((x === (void 0)) ? 1 : ((1 + x.hp) | 0));
  if ((($m_Lcom_raquo_airstream_core_Transaction$().gd === (-1)) || (this.hp > $m_Lcom_raquo_airstream_core_Transaction$().gd))) {
    $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded(this, $m_Lcom_raquo_airstream_core_Transaction$().gd));
  } else if ($m_Lcom_raquo_airstream_core_Transaction$onStart$().b7) {
    ($m_Lcom_raquo_airstream_core_Transaction$onStart$().dN.push(this) | 0);
  } else {
    $m_Lcom_raquo_airstream_core_Transaction$pendingTransactions$().iB(this);
  }
}
$p = $c_Lcom_raquo_airstream_core_Transaction.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Transaction;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Transaction() {
}
$h_Lcom_raquo_airstream_core_Transaction.prototype = $p;
$p.oS = (function(observable) {
  var x = this.fc;
  var x$1 = ((x === (void 0)) ? (void 0) : x.be(observable));
  return ((x$1 === (void 0)) ? false : x$1);
});
$p.pa = (function(observable) {
  var x = this.fc;
  if ((x === (void 0))) {
    var newQueue = new $c_Lcom_raquo_airstream_util_JsPriorityQueue(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((observable$1) => observable$1.hi)));
    this.fc = newQueue;
    var $x_1 = newQueue;
  } else {
    var $x_1 = x;
  }
  $x_1.p9(observable);
});
var $d_Lcom_raquo_airstream_core_Transaction = new $TypeData().i($c_Lcom_raquo_airstream_core_Transaction, "com.raquo.airstream.core.Transaction", ({
  cK: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_core_Transaction$() {
  this.gd = 0;
  this.jP = null;
  $n_Lcom_raquo_airstream_core_Transaction$ = this;
  this.gd = 1000;
  this.jP = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((trx) => {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), (("Attempted to run Transaction " + trx) + " after it was already executed."));
  }));
}
$p = $c_Lcom_raquo_airstream_core_Transaction$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Transaction$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Transaction$() {
}
$h_Lcom_raquo_airstream_core_Transaction$.prototype = $p;
$p.mL = (function(transaction) {
  try {
    transaction.ho.b(transaction);
    var x = transaction.fc;
    if ((x !== (void 0))) {
      while (((x.cZ.length | 0) !== 0)) {
        if (((x.cZ.length | 0) === 0)) {
          throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Unable to dequeue an empty JsPriorityQueue");
        }
        $f_Lcom_raquo_airstream_combine_CombineObservable__syncFire__Lcom_raquo_airstream_core_Transaction__V(x.cZ.shift(), transaction);
      }
    }
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    $m_Lcom_raquo_airstream_core_AirstreamError$().cc(e$2);
  }
});
var $d_Lcom_raquo_airstream_core_Transaction$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Transaction$, "com.raquo.airstream.core.Transaction$", ({
  cL: 1
}));
var $n_Lcom_raquo_airstream_core_Transaction$;
function $m_Lcom_raquo_airstream_core_Transaction$() {
  if ((!$n_Lcom_raquo_airstream_core_Transaction$)) {
    $n_Lcom_raquo_airstream_core_Transaction$ = new $c_Lcom_raquo_airstream_core_Transaction$();
  }
  return $n_Lcom_raquo_airstream_core_Transaction$;
}
function $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V($thiz) {
  if ((($thiz.ge.length | 0) === 0)) {
    if ((($thiz.dN.length | 0) > 0)) {
      new $c_Lcom_raquo_airstream_core_Transaction(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$3) => {
        while ((($thiz.dN.length | 0) > 0)) {
          $m_Lcom_raquo_airstream_core_Transaction$pendingTransactions$().iB($thiz.dN.shift());
        }
      })));
    }
  } else {
    new $c_Lcom_raquo_airstream_core_Transaction(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((trx) => {
      while ((($thiz.ge.length | 0) > 0)) {
        var callback = $thiz.ge.shift();
        try {
          callback.b(trx);
        } catch (e) {
          var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
          $m_Lcom_raquo_airstream_core_AirstreamError$().cc(e$2);
        }
      }
      while ((($thiz.dN.length | 0) > 0)) {
        var _trx = $thiz.dN.shift();
        $m_Lcom_raquo_airstream_core_Transaction$pendingTransactions$().iB(_trx);
      }
    })));
  }
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Transaction$onStart$() {
  this.b7 = false;
  this.ge = null;
  this.dN = null;
  $n_Lcom_raquo_airstream_core_Transaction$onStart$ = this;
  this.b7 = false;
  this.ge = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_F1.r().C)([])));
  this.dN = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Transaction.r().C)([])));
}
$p = $c_Lcom_raquo_airstream_core_Transaction$onStart$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Transaction$onStart$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Transaction$onStart$() {
}
$h_Lcom_raquo_airstream_core_Transaction$onStart$.prototype = $p;
var $d_Lcom_raquo_airstream_core_Transaction$onStart$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Transaction$onStart$, "com.raquo.airstream.core.Transaction$onStart$", ({
  cM: 1
}));
var $n_Lcom_raquo_airstream_core_Transaction$onStart$;
function $m_Lcom_raquo_airstream_core_Transaction$onStart$() {
  if ((!$n_Lcom_raquo_airstream_core_Transaction$onStart$)) {
    $n_Lcom_raquo_airstream_core_Transaction$onStart$ = new $c_Lcom_raquo_airstream_core_Transaction$onStart$();
  }
  return $n_Lcom_raquo_airstream_core_Transaction$onStart$;
}
function $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__maybeChildrenFor__Lcom_raquo_airstream_core_Transaction__O($thiz, transaction) {
  return $thiz.dO.get(transaction);
}
function $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__pushToStack__Lcom_raquo_airstream_core_Transaction__V($thiz, transaction) {
  $thiz.gf.unshift(transaction);
}
function $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__popStack__O($thiz) {
  return $thiz.gf.shift();
}
function $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__enqueueChild__Lcom_raquo_airstream_core_Transaction__Lcom_raquo_airstream_core_Transaction__V($thiz, parent, newChild) {
  var maybeChildren = $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__maybeChildrenFor__Lcom_raquo_airstream_core_Transaction__O($thiz, parent);
  var noChildrenFound = (maybeChildren === (void 0));
  var newChildren = ((maybeChildren === (void 0)) ? $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Transaction.r().C)([]))) : maybeChildren);
  newChildren.push(newChild);
  if (noChildrenFound) {
    $thiz.dO.set(parent, newChildren);
  }
}
function $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__dequeueChild__Lcom_raquo_airstream_core_Transaction__O($thiz, parent) {
  var maybeParentChildren = $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__maybeChildrenFor__Lcom_raquo_airstream_core_Transaction__O($thiz, parent);
  var x = (((maybeParentChildren === (void 0)) || ((maybeParentChildren.length | 0) > 0)) ? maybeParentChildren : (void 0));
  if ((x === (void 0))) {
    return (void 0);
  } else {
    var nextChild = x.shift();
    if (((x.length | 0) === 0)) {
      (!(!$thiz.dO.delete(parent)));
    }
    return nextChild;
  }
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_Transaction$pendingTransactions$() {
  this.gf = null;
  this.dO = null;
  $n_Lcom_raquo_airstream_core_Transaction$pendingTransactions$ = this;
  this.gf = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Transaction.r().C)([])));
  this.dO = new Map();
}
$p = $c_Lcom_raquo_airstream_core_Transaction$pendingTransactions$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Transaction$pendingTransactions$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Transaction$pendingTransactions$() {
}
$h_Lcom_raquo_airstream_core_Transaction$pendingTransactions$.prototype = $p;
$p.iB = (function(newTransaction) {
  var x = this.g8();
  if ((x === (void 0))) {
    $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__pushToStack__Lcom_raquo_airstream_core_Transaction__V(this, newTransaction);
    $m_Lcom_raquo_airstream_core_Transaction$().mL(newTransaction);
    this.p6(newTransaction);
  } else {
    $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__enqueueChild__Lcom_raquo_airstream_core_Transaction__Lcom_raquo_airstream_core_Transaction__V(this, x, newTransaction);
  }
});
$p.p6 = (function(transaction) {
  var transaction$tailLocal1 = transaction;
  while (true) {
    var x = this.g8();
    var elem = transaction$tailLocal1;
    if ((!((x !== (void 0)) && $m_sr_BoxesRunTime$().k(elem, x)))) {
      throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Transaction queue error: Completed transaction is not the first in stack. This is a bug in Airstream.");
    }
    this.qw(transaction$tailLocal1);
    transaction$tailLocal1.ho = $m_Lcom_raquo_airstream_core_Transaction$().jP;
    var maybeNextTransaction = this.g8();
    if ($m_sr_BoxesRunTime$().k(maybeNextTransaction, (void 0))) {
      if (((this.dO.size | 0) > 0)) {
        var numChildren = new $c_sr_IntRef(0);
        this.dO.forEach(((numChildren) => ((transactions, _$4) => {
          var ev$12 = ((numChildren.e7 + (transactions.length | 0)) | 0);
          numChildren.e7 = ev$12;
        }))(numChildren));
        throw $ct_jl_Exception__T__(new $c_jl_Exception(), (((("Transaction queue error: Stack cleared, but a total of " + numChildren.e7) + " children for ") + (this.dO.size | 0)) + " transactions remain. This is a bug in Airstream."));
      } else {
        return (void 0);
      }
    } else {
      $m_Lcom_raquo_airstream_core_Transaction$().mL(maybeNextTransaction);
      transaction$tailLocal1 = maybeNextTransaction;
    }
  }
});
$p.qw = (function(doneTransaction) {
  var doneTransaction$tailLocal1 = doneTransaction;
  while (true) {
    var maybeNextChildTrx = $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__dequeueChild__Lcom_raquo_airstream_core_Transaction__O(this, doneTransaction$tailLocal1);
    if ($m_sr_BoxesRunTime$().k(maybeNextChildTrx, (void 0))) {
      $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__popStack__O(this);
      var maybeParentTransaction = this.g8();
      if ((!$m_sr_BoxesRunTime$().k(maybeParentTransaction, (void 0)))) {
        doneTransaction$tailLocal1 = maybeParentTransaction;
      } else {
        return (void 0);
      }
    } else {
      $p_Lcom_raquo_airstream_core_Transaction$pendingTransactions$__pushToStack__Lcom_raquo_airstream_core_Transaction__V(this, maybeNextChildTrx);
      return (void 0);
    }
  }
});
$p.g8 = (function() {
  return this.gf[0];
});
var $d_Lcom_raquo_airstream_core_Transaction$pendingTransactions$ = new $TypeData().i($c_Lcom_raquo_airstream_core_Transaction$pendingTransactions$, "com.raquo.airstream.core.Transaction$pendingTransactions$", ({
  cN: 1
}));
var $n_Lcom_raquo_airstream_core_Transaction$pendingTransactions$;
function $m_Lcom_raquo_airstream_core_Transaction$pendingTransactions$() {
  if ((!$n_Lcom_raquo_airstream_core_Transaction$pendingTransactions$)) {
    $n_Lcom_raquo_airstream_core_Transaction$pendingTransactions$ = new $c_Lcom_raquo_airstream_core_Transaction$pendingTransactions$();
  }
  return $n_Lcom_raquo_airstream_core_Transaction$pendingTransactions$;
}
function $p_Lcom_raquo_airstream_ownership_DynamicOwner__removeSubscriptionNow__Lcom_raquo_airstream_ownership_DynamicSubscription__V($thiz, subscription) {
  var index = ($thiz.cX.indexOf(subscription) | 0);
  if ((index !== (-1))) {
    $thiz.cX.splice(index, 1);
    if ((!$thiz.bC.c())) {
      subscription.nm();
    }
  } else {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Can not remove DynamicSubscription from DynamicOwner: subscription not found. Did you already kill it?");
  }
}
function $p_Lcom_raquo_airstream_ownership_DynamicOwner__removePendingSubscriptionsNow__V($thiz) {
  while ((($thiz.gh.length | 0) > 0)) {
    $p_Lcom_raquo_airstream_ownership_DynamicOwner__removeSubscriptionNow__Lcom_raquo_airstream_ownership_DynamicSubscription__V($thiz, $thiz.gh.shift());
  }
}
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_DynamicOwner(onAccessAfterKilled) {
  this.jX = null;
  this.cX = null;
  this.eo = false;
  this.gh = null;
  this.bC = null;
  this.ep = 0;
  this.jX = onAccessAfterKilled;
  this.cX = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_ownership_DynamicSubscription.r().C)([])));
  this.eo = true;
  this.gh = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_ownership_DynamicSubscription.r().C)([])));
  this.bC = $m_s_None$();
  this.ep = 0;
}
$p = $c_Lcom_raquo_airstream_ownership_DynamicOwner.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_DynamicOwner;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_DynamicOwner() {
}
$h_Lcom_raquo_airstream_ownership_DynamicOwner.prototype = $p;
$p.ms = (function() {
  if ((!(!this.bC.c()))) {
    var this$4 = $m_Lcom_raquo_airstream_core_Transaction$onStart$();
    var f = (() => {
      var newOwner = new $c_Lcom_raquo_airstream_ownership_OneTimeOwner(this.jX);
      this.bC = new $c_s_Some(newOwner);
      this.eo = false;
      this.ep = 0;
      var i = 0;
      var originalNumSubs = (this.cX.length | 0);
      while ((i < originalNumSubs)) {
        var ix = ((i + this.ep) | 0);
        this.cX[ix].nk(newOwner);
        i = ((1 + i) | 0);
      }
      $p_Lcom_raquo_airstream_ownership_DynamicOwner__removePendingSubscriptionsNow__V(this);
      this.eo = true;
      this.ep = 0;
    });
    $m_Lcom_raquo_airstream_core_Transaction$onStart$();
    var when = true;
    if ((this$4.b7 || (!when))) {
      f();
    } else {
      this$4.b7 = true;
      try {
        f();
      } finally {
        this$4.b7 = false;
        $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V(this$4);
      }
    }
  } else {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), (("Can not activate " + this) + ": it is already active"));
  }
});
$p.mQ = (function() {
  if ((!this.bC.c())) {
    this.eo = false;
    var arr = this.cX;
    var i = 0;
    var len = (arr.length | 0);
    while ((i < len)) {
      arr[i].nm();
      i = ((1 + i) | 0);
    }
    $p_Lcom_raquo_airstream_ownership_DynamicOwner__removePendingSubscriptionsNow__V(this);
    var this$4 = this.bC;
    if ((!this$4.c())) {
      this$4.y().q4();
    }
    $p_Lcom_raquo_airstream_ownership_DynamicOwner__removePendingSubscriptionsNow__V(this);
    this.eo = true;
    this.bC = $m_s_None$();
  } else {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Can not deactivate DynamicOwner: it is not active");
  }
});
$p.ot = (function(subscription, prepend) {
  if (prepend) {
    this.ep = ((1 + this.ep) | 0);
    this.cX.unshift(subscription);
  } else {
    this.cX.push(subscription);
  }
  var this$1 = this.bC;
  if ((!this$1.c())) {
    var x0 = this$1.y();
    subscription.nk(x0);
  }
});
$p.qD = (function(subscription) {
  if (this.eo) {
    $p_Lcom_raquo_airstream_ownership_DynamicOwner__removeSubscriptionNow__Lcom_raquo_airstream_ownership_DynamicSubscription__V(this, subscription);
  } else {
    this.gh.push(subscription);
  }
});
var $d_Lcom_raquo_airstream_ownership_DynamicOwner = new $TypeData().i($c_Lcom_raquo_airstream_ownership_DynamicOwner, "com.raquo.airstream.ownership.DynamicOwner", ({
  cP: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_DynamicSubscription(dynamicOwner, activate, prepend) {
  this.gi = null;
  this.jY = null;
  this.gj = null;
  this.gi = dynamicOwner;
  this.jY = activate;
  this.gj = $m_s_None$();
  dynamicOwner.ot(this, prepend);
}
$p = $c_Lcom_raquo_airstream_ownership_DynamicSubscription.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_DynamicSubscription;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_DynamicSubscription() {
}
$h_Lcom_raquo_airstream_ownership_DynamicSubscription.prototype = $p;
$p.g5 = (function() {
  this.gi.qD(this);
});
$p.nk = (function(owner) {
  var this$2 = $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var f = (() => {
    this.gj = this.jY.b(owner);
  });
  $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var when = true;
  if ((this$2.b7 || (!when))) {
    f();
  } else {
    this$2.b7 = true;
    try {
      f();
    } finally {
      this$2.b7 = false;
      $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V(this$2);
    }
  }
});
$p.nm = (function() {
  var this$1 = this.gj;
  if ((!this$1.c())) {
    this$1.y().g5();
    this.gj = $m_s_None$();
  }
});
var $d_Lcom_raquo_airstream_ownership_DynamicSubscription = new $TypeData().i($c_Lcom_raquo_airstream_ownership_DynamicSubscription, "com.raquo.airstream.ownership.DynamicSubscription", ({
  cQ: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_DynamicSubscription$() {
}
$p = $c_Lcom_raquo_airstream_ownership_DynamicSubscription$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_DynamicSubscription$;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_DynamicSubscription$() {
}
$h_Lcom_raquo_airstream_ownership_DynamicSubscription$.prototype = $p;
$p.f0 = (function(dynamicOwner, activate, prepend) {
  return new $c_Lcom_raquo_airstream_ownership_DynamicSubscription(dynamicOwner, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => new $c_s_Some(activate.b(owner)))), prepend);
});
$p.nG = (function(dynamicOwner, activate, prepend) {
  return new $c_Lcom_raquo_airstream_ownership_DynamicSubscription(dynamicOwner, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => {
    activate.b(owner);
    return $m_s_None$();
  })), prepend);
});
$p.qY = (function(dynamicOwner, observable, onNext) {
  return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(dynamicOwner, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => $f_Lcom_raquo_airstream_core_BaseObservable__foreach__F1__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription(observable, onNext, owner))), false);
});
var $d_Lcom_raquo_airstream_ownership_DynamicSubscription$ = new $TypeData().i($c_Lcom_raquo_airstream_ownership_DynamicSubscription$, "com.raquo.airstream.ownership.DynamicSubscription$", ({
  cR: 1
}));
var $n_Lcom_raquo_airstream_ownership_DynamicSubscription$;
function $m_Lcom_raquo_airstream_ownership_DynamicSubscription$() {
  if ((!$n_Lcom_raquo_airstream_ownership_DynamicSubscription$)) {
    $n_Lcom_raquo_airstream_ownership_DynamicSubscription$ = new $c_Lcom_raquo_airstream_ownership_DynamicSubscription$();
  }
  return $n_Lcom_raquo_airstream_ownership_DynamicSubscription$;
}
function $f_Lcom_raquo_airstream_ownership_Owner__$init$__V($thiz) {
  $thiz.eq = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_ownership_Subscription.r().C)([])));
}
function $f_Lcom_raquo_airstream_ownership_Owner__killSubscriptions__V($thiz) {
  var arr = $thiz.eq;
  var i = 0;
  var len = (arr.length | 0);
  while ((i < len)) {
    $p_Lcom_raquo_airstream_ownership_Subscription__safeCleanup__V(arr[i]);
    i = ((1 + i) | 0);
  }
  $thiz.eq.length = 0;
}
function $f_Lcom_raquo_airstream_ownership_Owner__onKilledExternally__Lcom_raquo_airstream_ownership_Subscription__V($thiz, subscription) {
  var index = ($thiz.eq.indexOf(subscription) | 0);
  if ((index !== (-1))) {
    $thiz.eq.splice(index, 1);
  } else {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Can not remove Subscription from Owner: subscription not found.");
  }
}
function $f_Lcom_raquo_airstream_ownership_Owner__own__Lcom_raquo_airstream_ownership_Subscription__V($thiz, subscription) {
  $thiz.eq.push(subscription);
}
function $p_Lcom_raquo_airstream_ownership_Subscription__safeCleanup__V($thiz) {
  if ((!$thiz.hw)) {
    $thiz.k0.L();
    $thiz.hw = true;
  } else {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Can not kill Subscription: it was already killed.");
  }
}
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_Subscription(owner, cleanup) {
  this.k1 = null;
  this.k0 = null;
  this.hw = false;
  this.k1 = owner;
  this.k0 = cleanup;
  this.hw = false;
  owner.qu(this);
}
$p = $c_Lcom_raquo_airstream_ownership_Subscription.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_Subscription;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_Subscription() {
}
$h_Lcom_raquo_airstream_ownership_Subscription.prototype = $p;
$p.g5 = (function() {
  $p_Lcom_raquo_airstream_ownership_Subscription__safeCleanup__V(this);
  $f_Lcom_raquo_airstream_ownership_Owner__onKilledExternally__Lcom_raquo_airstream_ownership_Subscription__V(this.k1, this);
});
var $d_Lcom_raquo_airstream_ownership_Subscription = new $TypeData().i($c_Lcom_raquo_airstream_ownership_Subscription, "com.raquo.airstream.ownership.Subscription", ({
  cU: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_TransferableSubscription(activate, deactivate) {
  this.k2 = null;
  this.k3 = null;
  this.cY = null;
  this.dP = false;
  this.k2 = activate;
  this.k3 = deactivate;
  this.cY = $m_s_None$();
  this.dP = false;
}
$p = $c_Lcom_raquo_airstream_ownership_TransferableSubscription.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_TransferableSubscription;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_TransferableSubscription() {
}
$h_Lcom_raquo_airstream_ownership_TransferableSubscription.prototype = $p;
$p.pX = (function() {
  var this$1 = this.cY;
  return ((!this$1.c()) && (!this$1.y().gi.bC.c()));
});
$p.qS = (function(nextOwner) {
  if (this.dP) {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Unable to set owner on DynamicTransferableSubscription while a transfer on this subscription is already in progress.");
  }
  var this$1 = this.cY;
  if ((!this$1.c())) {
    var x0 = this$1.y();
    var x$2 = x0.gi;
    var $x_1 = ((nextOwner === null) ? (x$2 === null) : (nextOwner === x$2));
  } else {
    var $x_1 = false;
  }
  if ((!$x_1)) {
    if ((this.pX() && (!nextOwner.bC.c()))) {
      this.dP = true;
    }
    var this$3 = this.cY;
    if ((!this$3.c())) {
      this$3.y().g5();
      this.cY = $m_s_None$();
    }
    var newPilotSubscription = $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(nextOwner, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((parentOwner) => {
      if ((!this.dP)) {
        this.k2.L();
      }
      return new $c_Lcom_raquo_airstream_ownership_Subscription(parentOwner, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
        if ((!this.dP)) {
          this.k3.L();
        }
      })));
    })), false);
    this.cY = new $c_s_Some(newPilotSubscription);
    this.dP = false;
  }
});
$p.oL = (function() {
  if (this.dP) {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Unable to clear owner on DynamicTransferableSubscription while a transfer on this subscription is already in progress.");
  }
  var this$1 = this.cY;
  if ((!this$1.c())) {
    this$1.y().g5();
  }
  this.cY = $m_s_None$();
});
var $d_Lcom_raquo_airstream_ownership_TransferableSubscription = new $TypeData().i($c_Lcom_raquo_airstream_ownership_TransferableSubscription, "com.raquo.airstream.ownership.TransferableSubscription", ({
  cV: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_state_Var$() {
}
$p = $c_Lcom_raquo_airstream_state_Var$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_state_Var$;
/** @constructor */
function $h_Lcom_raquo_airstream_state_Var$() {
}
$h_Lcom_raquo_airstream_state_Var$.prototype = $p;
$p.gS = (function(initial) {
  return new $c_Lcom_raquo_airstream_state_SourceVar(new $c_s_util_Success(initial));
});
var $d_Lcom_raquo_airstream_state_Var$ = new $TypeData().i($c_Lcom_raquo_airstream_state_Var$, "com.raquo.airstream.state.Var$", ({
  cZ: 1
}));
var $n_Lcom_raquo_airstream_state_Var$;
function $m_Lcom_raquo_airstream_state_Var$() {
  if ((!$n_Lcom_raquo_airstream_state_Var$)) {
    $n_Lcom_raquo_airstream_state_Var$ = new $c_Lcom_raquo_airstream_state_Var$();
  }
  return $n_Lcom_raquo_airstream_state_Var$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_util_JsPriorityQueue(getRank) {
  this.hC = null;
  this.cZ = null;
  this.hC = getRank;
  this.cZ = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().n8(new $ac_O([])));
}
$p = $c_Lcom_raquo_airstream_util_JsPriorityQueue.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_util_JsPriorityQueue;
/** @constructor */
function $h_Lcom_raquo_airstream_util_JsPriorityQueue() {
}
$h_Lcom_raquo_airstream_util_JsPriorityQueue.prototype = $p;
$p.p9 = (function(item) {
  var itemRank = (this.hC.b(item) | 0);
  var insertAtIndex = 0;
  var foundHigherRank = false;
  while (((insertAtIndex < (this.cZ.length | 0)) && (!foundHigherRank))) {
    if (((this.hC.b(this.cZ[insertAtIndex]) | 0) > itemRank)) {
      foundHigherRank = true;
    } else {
      insertAtIndex = ((1 + insertAtIndex) | 0);
    }
  }
  this.cZ.splice(insertAtIndex, 0, item);
});
$p.be = (function(item) {
  return ((this.cZ.indexOf(item) | 0) !== (-1));
});
var $d_Lcom_raquo_airstream_util_JsPriorityQueue = new $TypeData().i($c_Lcom_raquo_airstream_util_JsPriorityQueue, "com.raquo.airstream.util.JsPriorityQueue", ({
  d2: 1
}));
/** @constructor */
function $c_Lcom_raquo_ew_JsArray$() {
}
$p = $c_Lcom_raquo_ew_JsArray$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_ew_JsArray$;
/** @constructor */
function $h_Lcom_raquo_ew_JsArray$() {
}
$h_Lcom_raquo_ew_JsArray$.prototype = $p;
$p.aF = (function(items) {
  return [...$m_sjsr_Compat$().r6(items)];
});
var $d_Lcom_raquo_ew_JsArray$ = new $TypeData().i($c_Lcom_raquo_ew_JsArray$, "com.raquo.ew.JsArray$", ({
  d3: 1
}));
var $n_Lcom_raquo_ew_JsArray$;
function $m_Lcom_raquo_ew_JsArray$() {
  if ((!$n_Lcom_raquo_ew_JsArray$)) {
    $n_Lcom_raquo_ew_JsArray$ = new $c_Lcom_raquo_ew_JsArray$();
  }
  return $n_Lcom_raquo_ew_JsArray$;
}
/** @constructor */
function $c_Lcom_raquo_ew_JsArray$RichJsArray$() {
}
$p = $c_Lcom_raquo_ew_JsArray$RichJsArray$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_ew_JsArray$RichJsArray$;
/** @constructor */
function $h_Lcom_raquo_ew_JsArray$RichJsArray$() {
}
$h_Lcom_raquo_ew_JsArray$RichJsArray$.prototype = $p;
$p.j6 = (function(this$, item, fromIndex) {
  return ((this$.indexOf(item, fromIndex) | 0) !== (-1));
});
$p.pj = (function(this$, cb) {
  var i = 0;
  var len = (this$.length | 0);
  while ((i < len)) {
    cb(this$[i]);
    i = ((1 + i) | 0);
  }
});
var $d_Lcom_raquo_ew_JsArray$RichJsArray$ = new $TypeData().i($c_Lcom_raquo_ew_JsArray$RichJsArray$, "com.raquo.ew.JsArray$RichJsArray$", ({
  d4: 1
}));
var $n_Lcom_raquo_ew_JsArray$RichJsArray$;
function $m_Lcom_raquo_ew_JsArray$RichJsArray$() {
  if ((!$n_Lcom_raquo_ew_JsArray$RichJsArray$)) {
    $n_Lcom_raquo_ew_JsArray$RichJsArray$ = new $c_Lcom_raquo_ew_JsArray$RichJsArray$();
  }
  return $n_Lcom_raquo_ew_JsArray$RichJsArray$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_DomApi$() {
  this.ke = null;
  $n_Lcom_raquo_laminar_DomApi$ = this;
  document.createElement("template");
  this.p0($m_Lcom_raquo_laminar_api_package$().w.r0().r1());
  this.ke = new RegExp(" ", "g");
}
$p = $c_Lcom_raquo_laminar_DomApi$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_DomApi$;
/** @constructor */
function $h_Lcom_raquo_laminar_DomApi$() {
}
$h_Lcom_raquo_laminar_DomApi$.prototype = $p;
$p.ov = (function(parent, child) {
  try {
    parent.appendChild(child);
    return true;
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (((e$2 instanceof $c_sjs_js_JavaScriptException) && (!(!(e$2.Z instanceof DOMException))))) {
      return false;
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.qB = (function(parent, child) {
  try {
    parent.removeChild(child);
    return true;
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (((e$2 instanceof $c_sjs_js_JavaScriptException) && (!(!(e$2.Z instanceof DOMException))))) {
      return false;
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.pR = (function(parent, newChild, referenceChild) {
  try {
    parent.insertBefore(newChild, referenceChild);
    return true;
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (((e$2 instanceof $c_sjs_js_JavaScriptException) && (!(!(e$2.Z instanceof DOMException))))) {
      return false;
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.pQ = (function(parent, newChild, referenceChild) {
  try {
    parent.insertBefore(newChild, referenceChild.nextSibling);
    return true;
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (((e$2 instanceof $c_sjs_js_JavaScriptException) && (!(!(e$2.Z instanceof DOMException))))) {
      return false;
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.qF = (function(parent, newChild, oldChild) {
  try {
    parent.replaceChild(newChild, oldChild);
    return true;
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (((e$2 instanceof $c_sjs_js_JavaScriptException) && (!(!(e$2.Z instanceof DOMException))))) {
      return false;
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.pZ = (function(node, ancestor) {
  var node$tailLocal1 = node;
  while (true) {
    if ((node$tailLocal1.parentNode !== null)) {
      var effectiveParentNode = node$tailLocal1.parentNode;
    } else {
      var maybeShadowHost = node$tailLocal1.host;
      var effectiveParentNode = ((maybeShadowHost === (void 0)) ? null : maybeShadowHost);
    }
    if ((effectiveParentNode === null)) {
      return false;
    }
    if ($m_sr_BoxesRunTime$().k(ancestor, effectiveParentNode)) {
      return true;
    }
    node$tailLocal1 = effectiveParentNode;
  }
});
$p.mx = (function(element, listener) {
  element.addEventListener(listener.bZ.bY.cg, listener.hR, listener.hS);
});
$p.nr = (function(element, listener) {
  element.removeEventListener(listener.bZ.bY.cg, listener.hR, listener.hS);
});
$p.oZ = (function(tag) {
  return document.createElement(tag.i0);
});
$p.pA = (function(element, attr) {
  var x = this.n9(element, attr);
  return ((x === (void 0)) ? (void 0) : attr.hK.iN(x));
});
$p.n9 = (function(element, attr) {
  var domValue = element.I.getAttributeNS(null, attr.fh);
  return ((domValue !== null) ? domValue : (void 0));
});
$p.nD = (function(element, attr, value) {
  this.qQ(element, attr, attr.hK.fZ(value));
});
$p.qQ = (function(element, attr, domValue) {
  if ((domValue === null)) {
    this.qC(element, attr);
  } else {
    element.I.setAttribute(attr.fh, domValue);
  }
});
$p.qC = (function(element, attr) {
  element.I.removeAttribute(attr.fh);
});
$p.pB = (function(element, prop) {
  return element.I[prop.bn];
});
$p.qR = (function(element, prop, value) {
  this.nE(element, prop, prop.hL.fZ(value));
});
$p.nE = (function(element, prop, value) {
  element.I[prop.bn] = value;
});
$p.qP = (function(element, style, value) {
  var ref = element.I;
  var styleCssName = style.hM;
  var prefixes = style.hN;
  var styleValue = ((value === null) ? null : $dp_toString__T(value));
  if ((styleValue === null)) {
    prefixes.bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((prefix) => ref.style.removeProperty((("" + prefix) + styleCssName)))));
    ref.style.removeProperty(styleCssName);
  } else {
    prefixes.bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((prefix$2) => {
      var \u03b41$ = ref.style;
      \u03b41$.setProperty((("" + prefix$2) + styleCssName), styleValue);
    })));
    var \u03b42$ = ref.style;
    \u03b42$.setProperty(styleCssName, styleValue);
  }
});
$p.p0 = (function(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag.lj);
});
$p.pE = (function(element, attr) {
  var x = this.pF(element, attr);
  return ((x === (void 0)) ? (void 0) : attr.hO.iN(x));
});
$p.pF = (function(element, attr) {
  var $x_2 = element.jn();
  var this$1 = attr.gq;
  var $x_1 = $x_2.getAttributeNS((this$1.c() ? null : this$1.y()), attr.hP);
  var domValue = $x_1;
  return ((domValue !== null) ? domValue : (void 0));
});
$p.qU = (function(element, attr, value) {
  this.qV(element, attr, attr.hO.fZ(value));
});
$p.qV = (function(element, attr, domValue) {
  if ((domValue === null)) {
    this.qE(element, attr);
  } else {
    var this$1 = attr.gq;
    if (this$1.c()) {
      element.jn().setAttribute(attr.gp, domValue);
    } else {
      var x0 = this$1.y();
      element.jn().setAttributeNS(x0, attr.gp, domValue);
    }
  }
});
$p.qE = (function(element, attr) {
  var $x_1 = element.jn();
  var this$1 = attr.gq;
  $x_1.removeAttributeNS((this$1.c() ? null : this$1.y()), attr.hP);
});
$p.oY = (function(text) {
  return document.createComment(text);
});
$p.p1 = (function(text) {
  return document.createTextNode(text);
});
$p.ed = (function(element) {
  return $m_sc_StringOps$().oR(element.tagName, 45);
});
$p.pz = (function(element) {
  if ((!(!(element instanceof HTMLInputElement)))) {
    if (((element.type === "checkbox") || (element.type === "radio"))) {
      return (!(!element.checked));
    }
  }
  if (this.ed(element)) {
    var x = element.checked;
    new $c_Lcom_raquo_laminar_DomApi$$anon$1(this);
    return ((x === (void 0)) ? (void 0) : (((typeof x) === "boolean") ? (!(!x)) : (void 0)));
  }
});
$p.qO = (function(element, checked) {
  if ((!(!(element instanceof HTMLInputElement)))) {
    if (((element.type === "checkbox") || (element.type === "radio"))) {
      element.checked = checked;
      return true;
    }
  }
  if (this.ed(element)) {
    element.checked = checked;
    return true;
  }
  return false;
});
$p.j4 = (function(element) {
  if ((!(!(element instanceof HTMLInputElement)))) {
    return element.value;
  } else if ((!(!(element instanceof HTMLTextAreaElement)))) {
    return element.value;
  } else if ((!(!(element instanceof HTMLSelectElement)))) {
    return element.value;
  } else if ((!(!(element instanceof HTMLButtonElement)))) {
    return element.value;
  } else if ((!(!(element instanceof HTMLOptionElement)))) {
    return element.value;
  } else if (this.ed(element)) {
    var x = element.value;
    new $c_Lcom_raquo_laminar_DomApi$$anon$2(this);
    return ((x === (void 0)) ? (void 0) : (((typeof x) === "string") ? x : (void 0)));
  } else {
    return (void 0);
  }
});
$p.nF = (function(element, value) {
  if ((!(!(element instanceof HTMLInputElement)))) {
    element.value = value;
    return true;
  } else if ((!(!(element instanceof HTMLTextAreaElement)))) {
    element.value = value;
    return true;
  } else if ((!(!(element instanceof HTMLSelectElement)))) {
    element.value = value;
    return true;
  } else if ((!(!(element instanceof HTMLButtonElement)))) {
    element.value = value;
    return true;
  } else if ((!(!(element instanceof HTMLOptionElement)))) {
    element.value = value;
    return true;
  } else if (this.ed(element)) {
    element.value = value;
    return true;
  } else {
    return false;
  }
});
$p.p3 = (function(element, initial) {
  var initial$tailLocal1 = initial;
  var element$tailLocal1 = element;
  while (true) {
    if ((element$tailLocal1 === null)) {
      return initial$tailLocal1;
    }
    var element$tailLocal1$tmp1 = element$tailLocal1.parentNode;
    var initial$tailLocal1$tmp1 = new $c_sci_$colon$colon(this.iM(element$tailLocal1), initial$tailLocal1);
    element$tailLocal1 = element$tailLocal1$tmp1;
    initial$tailLocal1 = initial$tailLocal1$tmp1;
  }
});
$p.iM = (function(node) {
  if ((!(!(node instanceof HTMLElement)))) {
    var id = node.id;
    if (($m_sc_StringOps$(), (id !== ""))) {
      var suffixStr = ("#" + id);
    } else {
      var classes = node.className;
      var suffixStr = (($m_sc_StringOps$(), (classes !== "")) ? ("." + classes.replace(this.ke, ".")) : "");
    }
    return (node.tagName.toLowerCase() + suffixStr);
  } else {
    return node.nodeName;
  }
});
$p.p2 = (function(node) {
  return ((!(!(node instanceof Element))) ? node.outerHTML : ((!(!(node instanceof Text))) ? (("Text(" + node.textContent) + ")") : ((!(!(node instanceof Comment))) ? (("Comment(" + node.textContent) + ")") : ((node === null) ? "<null>" : (("OtherNode(" + $dp_toString__T(node)) + ")")))));
});
var $d_Lcom_raquo_laminar_DomApi$ = new $TypeData().i($c_Lcom_raquo_laminar_DomApi$, "com.raquo.laminar.DomApi$", ({
  d5: 1
}));
var $n_Lcom_raquo_laminar_DomApi$;
function $m_Lcom_raquo_laminar_DomApi$() {
  if ((!$n_Lcom_raquo_laminar_DomApi$)) {
    $n_Lcom_raquo_laminar_DomApi$ = new $c_Lcom_raquo_laminar_DomApi$();
  }
  return $n_Lcom_raquo_laminar_DomApi$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_Seq(seq, scalaArray, jsArray) {
  this.hE = null;
  this.kf = null;
  this.hD = null;
  this.hE = seq;
  this.kf = scalaArray;
  this.hD = jsArray;
}
$p = $c_Lcom_raquo_laminar_Seq.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_Seq;
/** @constructor */
function $h_Lcom_raquo_laminar_Seq() {
}
$h_Lcom_raquo_laminar_Seq.prototype = $p;
$p.bz = (function(f) {
  if ((this.hE !== null)) {
    this.hE.bz(f);
  } else if ((this.hD !== null)) {
    $m_Lcom_raquo_ew_JsArray$RichJsArray$().pj(this.hD, $m_sjs_js_Any$().pu(f));
  } else {
    $m_sc_ArrayOps$().pl(this.kf, f);
  }
});
var $d_Lcom_raquo_laminar_Seq = new $TypeData().i($c_Lcom_raquo_laminar_Seq, "com.raquo.laminar.Seq", ({
  d8: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_Seq$() {
  $n_Lcom_raquo_laminar_Seq$ = this;
  $m_sci_Nil$();
}
$p = $c_Lcom_raquo_laminar_Seq$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_Seq$;
/** @constructor */
function $h_Lcom_raquo_laminar_Seq$() {
}
$h_Lcom_raquo_laminar_Seq$.prototype = $p;
var $d_Lcom_raquo_laminar_Seq$ = new $TypeData().i($c_Lcom_raquo_laminar_Seq$, "com.raquo.laminar.Seq$", ({
  d9: 1
}));
var $n_Lcom_raquo_laminar_Seq$;
function $m_Lcom_raquo_laminar_Seq$() {
  if ((!$n_Lcom_raquo_laminar_Seq$)) {
    $n_Lcom_raquo_laminar_Seq$ = new $c_Lcom_raquo_laminar_Seq$();
  }
  return $n_Lcom_raquo_laminar_Seq$;
}
function $f_Lcom_raquo_laminar_api_AirstreamAliases__$init$__V($thiz) {
  $m_Lcom_raquo_airstream_core_Observer$();
  $m_Lcom_raquo_airstream_core_AirstreamError$();
  $thiz.fd = $m_Lcom_raquo_airstream_state_Var$();
}
function $f_Lcom_raquo_laminar_api_LaminarAliases__$init$__V($thiz) {
  $thiz.nN = $m_Lcom_raquo_laminar_modifiers_Modifier$();
}
function $f_Lcom_raquo_laminar_api_MountHooks__$init$__V($thiz) {
  $f_Lcom_raquo_laminar_api_MountHooks__onMountCallback__F1__Lcom_raquo_laminar_modifiers_Modifier($thiz, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => {
    _$1.l6.I.focus();
  })));
}
function $f_Lcom_raquo_laminar_api_MountHooks__onMountCallback__F1__Lcom_raquo_laminar_modifiers_Modifier($thiz, fn) {
  return new $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((element) => {
    var ignoreNextActivation = new $c_sr_BooleanRef((!element.bK.bC.c()));
    var activate = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((c) => {
      if (ignoreNextActivation.gH) {
        var ev$5 = false;
        ignoreNextActivation.gH = ev$5;
      } else {
        fn.b(c);
      }
    }));
    $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().nG(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((element$2) => ((owner) => {
      activate.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element$2, owner));
    }))(element)), false);
  })), $m_Lcom_raquo_laminar_modifiers_Modifier$());
}
/** @constructor */
function $c_Lcom_raquo_laminar_codecs_package$() {
  this.dR = null;
  this.kT = null;
  $n_Lcom_raquo_laminar_codecs_package$ = this;
  this.dR = new $c_Lcom_raquo_laminar_codecs_package$$anon$2($m_Lcom_raquo_laminar_codecs_package$());
  new $c_Lcom_raquo_laminar_codecs_package$$anon$2($m_Lcom_raquo_laminar_codecs_package$());
  this.kT = new $c_Lcom_raquo_laminar_codecs_package$$anon$2($m_Lcom_raquo_laminar_codecs_package$());
}
$p = $c_Lcom_raquo_laminar_codecs_package$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_codecs_package$;
/** @constructor */
function $h_Lcom_raquo_laminar_codecs_package$() {
}
$h_Lcom_raquo_laminar_codecs_package$.prototype = $p;
var $d_Lcom_raquo_laminar_codecs_package$ = new $TypeData().i($c_Lcom_raquo_laminar_codecs_package$, "com.raquo.laminar.codecs.package$", ({
  dh: 1
}));
var $n_Lcom_raquo_laminar_codecs_package$;
function $m_Lcom_raquo_laminar_codecs_package$() {
  if ((!$n_Lcom_raquo_laminar_codecs_package$)) {
    $n_Lcom_raquo_laminar_codecs_package$ = new $c_Lcom_raquo_laminar_codecs_package$();
  }
  return $n_Lcom_raquo_laminar_codecs_package$;
}
function $f_Lcom_raquo_laminar_defs_complex_ComplexHtmlKeys__$init$__V($thiz) {
  $thiz.kq = $f_Lcom_raquo_laminar_defs_complex_ComplexHtmlKeys__stringCompositeHtmlAttr__T__T__Lcom_raquo_laminar_keys_CompositeKey($thiz, "class", " ");
  $thiz.dQ = $thiz.kq;
}
function $f_Lcom_raquo_laminar_defs_complex_ComplexHtmlKeys__stringCompositeHtmlAttr__T__T__Lcom_raquo_laminar_keys_CompositeKey($thiz, name, separator) {
  var attr = new $c_Lcom_raquo_laminar_keys_HtmlAttr(name, $m_Lcom_raquo_laminar_codecs_package$().dR);
  return new $c_Lcom_raquo_laminar_keys_CompositeKey(attr.fh, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((el) => {
    var x = $m_Lcom_raquo_laminar_DomApi$().pA(el, attr);
    return ((x === (void 0)) ? "" : x);
  })), new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((el$2, value) => {
    $m_Lcom_raquo_laminar_DomApi$().nD(el$2, attr, value);
  })), separator);
}
function $f_Lcom_raquo_laminar_defs_complex_ComplexSvgKeys__$init$__V($thiz) {
  $thiz.nM = $f_Lcom_raquo_laminar_defs_complex_ComplexSvgKeys__stringCompositeSvgAttr__T__T__Lcom_raquo_laminar_keys_CompositeKey($thiz, "class", " ");
}
function $f_Lcom_raquo_laminar_defs_complex_ComplexSvgKeys__stringCompositeSvgAttr__T__T__Lcom_raquo_laminar_keys_CompositeKey($thiz, name, separator) {
  var attr = new $c_Lcom_raquo_laminar_keys_SvgAttr(name, $m_Lcom_raquo_laminar_codecs_package$().dR, $m_s_None$());
  return new $c_Lcom_raquo_laminar_keys_CompositeKey(attr.gp, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((el) => {
    var x = $m_Lcom_raquo_laminar_DomApi$().pE(el, attr);
    return ((x === (void 0)) ? "" : x);
  })), new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((el$2, value) => {
    $m_Lcom_raquo_laminar_DomApi$().qU(el$2, attr, value);
  })), separator);
}
function $p_Lcom_raquo_laminar_inputs_InputController__setValue__O__Z__V($thiz, nextValue, force) {
  if ((force || (!$m_sr_BoxesRunTime$().k(nextValue, $thiz.er.kY.b($thiz.aB))))) {
    $thiz.er.kZ.dB($thiz.aB, nextValue);
  }
  $thiz.gk = nextValue;
}
function $p_Lcom_raquo_laminar_inputs_InputController__combinedObserver__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_core_Observer($thiz, owner) {
  var latestSourceValue = new $c_sr_ObjectRef($m_s_None$());
  $f_Lcom_raquo_airstream_core_BaseObservable__foreach__F1__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz.gl.hT, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((sourceValue) => {
    var ev$21 = new $c_s_Some(sourceValue);
    latestSourceValue.Y = ev$21;
    ev$21 = null;
    $p_Lcom_raquo_laminar_inputs_InputController__setValue__O__Z__V($thiz, sourceValue, false);
  })), owner);
  var resetObserver = $m_Lcom_raquo_airstream_core_Observer$().he(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$2) => {
    var this$4 = latestSourceValue.Y;
    $p_Lcom_raquo_laminar_inputs_InputController__setValue__O__Z__V($thiz, (this$4.c() ? $thiz.gk : this$4.y()), false);
  })), $m_s_PartialFunction$().ey, true);
  var this$7 = $m_Lcom_raquo_airstream_core_Observer$();
  return new $c_Lcom_raquo_airstream_core_Observer$$anon$10($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Observer.r().C)([$m_Lcom_raquo_airstream_core_Observer$().he($thiz.hF.l9, $m_s_PartialFunction$().ey, true), resetObserver])), this$7);
}
function $p_Lcom_raquo_laminar_inputs_InputController__checkControllerCompatibility__V($thiz) {
  if ($thiz.aB.pI($thiz)) {
    var propDomName$1 = $thiz.bm();
    var eventPropName$1 = $thiz.dG();
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co(propDomName$1, eventPropName$1, $thiz.aB, (("Element already has a `" + $thiz.bm()) + "` controller."), ($m_Lcom_raquo_laminar_inputs_InputController$(), "")));
  }
  if ($thiz.aB.pH($thiz.bm())) {
    var propDomName$2 = $thiz.bm();
    var eventPropName$2 = $thiz.dG();
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co(propDomName$2, eventPropName$2, $thiz.aB, (("Element already has an uncontrolled `" + $thiz.bm()) + " <-- ???` binder."), ($m_Lcom_raquo_laminar_inputs_InputController$(), "")));
  }
  if ($m_Lcom_raquo_laminar_DomApi$().ed($thiz.aB.I)) {
    matchResult1: {
      var x1 = $thiz.aB.fm;
      if (false) {
        var maybeAllowedConfigs = x1.rl($thiz.aB.I);
        if ((maybeAllowedConfigs === (void 0))) {
          var $x_1 = true;
        } else {
          if ((maybeAllowedConfigs === (void 0))) {
            throw new $c_ju_NoSuchElementException("undefined.get");
          }
          var $x_2 = maybeAllowedConfigs.length;
          var $x_1 = (($x_2 | 0) === 0);
        }
        if ($x_1) {
          var propDomName$3 = $thiz.bm();
          var eventPropName$3 = $thiz.dG();
          throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co(propDomName$3, eventPropName$3, $thiz.aB, "This element does not support any controlled props.", ($m_Lcom_raquo_laminar_inputs_InputController$(), "")));
        } else {
          if ((maybeAllowedConfigs === (void 0))) {
            var maybeMatchingPropConfig = (void 0);
          } else {
            _return: {
              var len = (maybeAllowedConfigs.length | 0);
              var i = 0;
              while ((i < len)) {
                var x0 = maybeAllowedConfigs[i];
                var x = x0.go;
                var x$2 = $thiz.gl.dV;
                if (((x === null) ? (x$2 === null) : (x === x$2))) {
                  var idx = i;
                  break _return;
                }
                i = ((1 + i) | 0);
              }
              var idx = (-1);
            }
            var opt = ((idx === (-1)) ? $m_s_None$() : new $c_s_Some(maybeAllowedConfigs[idx]));
            var maybeMatchingPropConfig = (opt.c() ? (void 0) : opt.y());
          }
          if ((maybeMatchingPropConfig === (void 0))) {
            if ((maybeAllowedConfigs === (void 0))) {
              var $x_5;
              throw new $c_ju_NoSuchElementException("undefined.get");
            } else {
              var $x_5 = maybeAllowedConfigs;
            }
            var $x_4 = $x_5.map(((_$5) => _$5.go.bn));
            var $x_3 = $x_4.join("` or `");
            var expectedPropNames = (("`" + $x_3) + "`");
            throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co($thiz.bm(), $thiz.dG(), $thiz.aB, (("This element does not support `" + $thiz.bm()) + "` controlled property"), (("Use " + expectedPropNames) + " controlled property instead")));
          } else {
            $p_Lcom_raquo_laminar_inputs_InputController__checkEventPropCompatibility__Lcom_raquo_ew_JsArray__V($thiz, maybeMatchingPropConfig.gn);
            break matchResult1;
          }
        }
      }
    }
  } else {
    var expectedPropName = $thiz.er.go.bn;
    if (($thiz.bm() !== expectedPropName)) {
      throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co($thiz.bm(), $thiz.dG(), $thiz.aB, (("This element does not support `" + $thiz.bm()) + "` controlled property"), (("Use `" + expectedPropName) + "` controlled property instead")));
    } else {
      $p_Lcom_raquo_laminar_inputs_InputController__checkEventPropCompatibility__Lcom_raquo_ew_JsArray__V($thiz, $thiz.er.gn);
    }
  }
}
function $p_Lcom_raquo_laminar_inputs_InputController__checkEventPropCompatibility__Lcom_raquo_ew_JsArray__V($thiz, expectedEventProps) {
  var expectedEventProps$2 = $thiz.er.gn;
  _return: {
    var len = (expectedEventProps$2.length | 0);
    var i = 0;
    while ((i < len)) {
      if ((expectedEventProps$2[i].cg === $thiz.dG())) {
        var $x_1 = i;
        break _return;
      }
      i = ((1 + i) | 0);
    }
    var $x_1 = (-1);
  }
  if (($x_1 < 0)) {
    var expectedEventPropNames = (("`" + expectedEventProps$2.map(((_$7) => _$7.cg)).join("` or `")) + "`");
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), $m_Lcom_raquo_laminar_inputs_InputController$().co($thiz.bm(), $thiz.dG(), $thiz.aB, (("This element does not support `" + $thiz.dG()) + "` event for controlled inputs"), (("Use " + expectedEventPropNames) + " event instead")));
  }
}
/** @constructor */
function $c_Lcom_raquo_laminar_inputs_InputController(config, element, updater, listener) {
  this.er = null;
  this.aB = null;
  this.gl = null;
  this.hF = null;
  this.gk = null;
  this.kU = null;
  this.er = config;
  this.aB = element;
  this.gl = updater;
  this.hF = listener;
  this.gk = config.hG;
  this.kU = listener.bZ.qs(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => {
    $p_Lcom_raquo_laminar_inputs_InputController__setValue__O__Z__V(this, this.gk, false);
  })));
  $p_Lcom_raquo_laminar_inputs_InputController__setValue__O__Z__V(this, config.hG, true);
}
$p = $c_Lcom_raquo_laminar_inputs_InputController.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inputs_InputController;
/** @constructor */
function $h_Lcom_raquo_laminar_inputs_InputController() {
}
$h_Lcom_raquo_laminar_inputs_InputController.prototype = $p;
$p.bm = (function() {
  return this.gl.dV.bn;
});
$p.dG = (function() {
  return this.hF.bZ.bY.cg;
});
$p.oE = (function() {
  var element = this.aB;
  var subscribe = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ctx) => {
    $p_Lcom_raquo_laminar_inputs_InputController__checkControllerCompatibility__V(this);
    var this$2 = this.aB;
    var x = this$2.cv;
    if ((x !== (void 0))) {
      var i = 0;
      var len = (x.length | 0);
      while ((i < len)) {
        var arg1$2 = x[i];
        $m_Lcom_raquo_laminar_DomApi$().nr(this.aB.I, arg1$2);
        i = ((1 + i) | 0);
      }
    }
    var dynSub = new $c_Lcom_raquo_laminar_modifiers_EventListener(this.kU, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((sink) => ((_$1) => {
      sink.eV(_$1);
    }))($p_Lcom_raquo_laminar_inputs_InputController__combinedObserver__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_core_Observer(this, ctx.fi)))).mI(this.aB, true);
    var this$12 = this.aB;
    var x$1 = this$12.cv;
    if ((x$1 !== (void 0))) {
      var i$1 = 0;
      var len$1 = (x$1.length | 0);
      while ((i$1 < len$1)) {
        var arg1$2$1 = x$1[i$1];
        $m_Lcom_raquo_laminar_DomApi$().mx(this.aB.I, arg1$2$1);
        i$1 = ((1 + i$1) | 0);
      }
    }
    return new $c_Lcom_raquo_airstream_ownership_Subscription(ctx.fi, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
      dynSub.g5();
    })));
  }));
  return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => subscribe.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element, owner)))), false);
});
var $d_Lcom_raquo_laminar_inputs_InputController = new $TypeData().i($c_Lcom_raquo_laminar_inputs_InputController, "com.raquo.laminar.inputs.InputController", ({
  dx: 1
}));
function $p_Lcom_raquo_laminar_inputs_InputController$__nodeDescription__Lcom_raquo_laminar_nodes_ReactiveHtmlElement__T($thiz, element) {
  var maybeTyp = $m_Lcom_raquo_laminar_DomApi$().n9(element, $m_Lcom_raquo_laminar_api_package$().w.nI());
  var x = ((maybeTyp === (void 0)) ? (void 0) : ((" [type=" + maybeTyp) + "]"));
  var typSuffix = ((x === (void 0)) ? "" : x);
  return (("" + $m_Lcom_raquo_laminar_DomApi$().iM(element.I)) + typSuffix);
}
/** @constructor */
function $c_Lcom_raquo_laminar_inputs_InputController$() {
  this.gm = null;
  this.kX = null;
  this.kV = null;
  this.kW = null;
  $n_Lcom_raquo_laminar_inputs_InputController$ = this;
  this.gm = new $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig("", $m_Lcom_raquo_laminar_api_package$().w.jv(), $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_laminar_keys_EventProp.r().C)([$m_Lcom_raquo_laminar_api_package$().w.h8()]))), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((el) => {
    var x = $m_Lcom_raquo_laminar_DomApi$().j4(el.I);
    return ((x === (void 0)) ? "" : x);
  })), new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((el$2, v) => {
    $m_Lcom_raquo_laminar_DomApi$().nF(el$2.I, v);
  })));
  this.kX = new $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig("", $m_Lcom_raquo_laminar_api_package$().w.jv(), $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_laminar_keys_EventProp.r().C)([$m_Lcom_raquo_laminar_api_package$().w.h8(), $m_Lcom_raquo_laminar_api_package$().w.qr()]))), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((el$3) => {
    var x$1 = $m_Lcom_raquo_laminar_DomApi$().j4(el$3.I);
    return ((x$1 === (void 0)) ? "" : x$1);
  })), new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((el$4, v$2) => {
    $m_Lcom_raquo_laminar_DomApi$().nF(el$4.I, v$2);
  })));
  this.kV = new $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig(false, $m_Lcom_raquo_laminar_api_package$().w.oJ(), $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_laminar_keys_EventProp.r().C)([$m_Lcom_raquo_laminar_api_package$().w.h8(), $m_Lcom_raquo_laminar_api_package$().w.nl()]))), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((el$5) => {
    var x$2 = $m_Lcom_raquo_laminar_DomApi$().pz(el$5.I);
    return (!(!((x$2 === (void 0)) ? false : x$2)));
  })), new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((v1, v2) => {
    var v$1 = (!(!v2));
    $m_Lcom_raquo_laminar_DomApi$().qO(v1.I, v$1);
  })));
  this.kW = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_T.r().C)(["value", "checked"])));
}
$p = $c_Lcom_raquo_laminar_inputs_InputController$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inputs_InputController$;
/** @constructor */
function $h_Lcom_raquo_laminar_inputs_InputController$() {
}
$h_Lcom_raquo_laminar_inputs_InputController$.prototype = $p;
$p.oT = (function(listener, updater) {
  return new $c_Lcom_raquo_laminar_modifiers_Binder$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((element) => {
    var propDomName = updater.dV.bn;
    var maybeControllableProps = element.mN();
    if (((maybeControllableProps !== (void 0)) && $m_Lcom_raquo_ew_JsArray$RichJsArray$().j6(maybeControllableProps, propDomName, 0))) {
      if ($m_Lcom_raquo_laminar_DomApi$().ed(element.I)) {
        matchResult2: {
          var controller;
          var x3 = element.fm;
          if (false) {
            var x = x3.rk(updater.dV);
            if ((x === (void 0))) {
              var eventPropName = listener.bZ.bY.cg;
              throw $ct_jl_Exception__T__(new $c_jl_Exception(), this.co(updater.dV.bn, eventPropName, element, (("This element does not support `" + propDomName) + "` controlled property in its current configuration"), "Make sure you passed the right props / attributes, such as `type` for HTML inputs."));
            }
            var controller = new $c_Lcom_raquo_laminar_inputs_InputController(x, element, updater, listener);
            break matchResult2;
          }
          throw $ct_jl_Exception__T__(new $c_jl_Exception(), (("Custom element `" + $p_Lcom_raquo_laminar_inputs_InputController$__nodeDescription__Lcom_raquo_laminar_nodes_ReactiveHtmlElement__T(this, element)) + "` must use CustomHtmlTag in order to support `controlled` inputs."));
        }
      } else {
        var x$1 = this.ou(element.I);
        if ((x$1 === (void 0))) {
          throw $ct_jl_Exception__T__(new $c_jl_Exception(), this.co(propDomName, listener.bZ.bY.cg, element, "This element does not support any controlled input props.", ""));
        }
        var controller = new $c_Lcom_raquo_laminar_inputs_InputController(x$1, element, updater, listener);
      }
      return element.oF(controller);
    } else {
      var eventPropName$2 = listener.bZ.bY.cg;
      if ((maybeControllableProps === (void 0))) {
        throw $ct_jl_Exception__T__(new $c_jl_Exception(), this.co(propDomName, eventPropName$2, element, "This element does not support any controlled input props.", ""));
      }
      throw $ct_jl_Exception__T__(new $c_jl_Exception(), this.co(propDomName, eventPropName$2, element, (("This element does not support `" + propDomName) + "` controlled property"), (("Use `" + maybeControllableProps.join("` or `")) + "` controlled property instead")));
    }
  })), $m_Lcom_raquo_laminar_modifiers_Binder$());
});
$p.ou = (function(element) {
  if ((!(!(element instanceof HTMLInputElement)))) {
    switch (element.type) {
      case "text": {
        return this.gm;
        break;
      }
      case "checkbox":
      case "radio": {
        return this.kV;
        break;
      }
      case "file": {
        return (void 0);
        break;
      }
      default: {
        return this.gm;
      }
    }
  } else {
    return ((!(!(element instanceof HTMLTextAreaElement))) ? this.gm : ((!(!(element instanceof HTMLSelectElement))) ? this.kX : (void 0)));
  }
});
$p.co = (function(propDomName, eventPropName, element, reason, suggestion) {
  return $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_T.r().C)([(((((("Can not add input controller (prop: `" + propDomName) + "` + event: `") + eventPropName) + "`) to element `") + $p_Lcom_raquo_laminar_inputs_InputController$__nodeDescription__Lcom_raquo_laminar_nodes_ReactiveHtmlElement__T($m_Lcom_raquo_laminar_inputs_InputController$(), element)) + "`"), (($m_sc_StringOps$(), (reason !== "")) ? ("- Cause: " + reason) : ""), (($m_sc_StringOps$(), (suggestion !== "")) ? ("- Suggestion: " + suggestion) : "")]))).filter(((_$9) => {
    $m_sc_StringOps$();
    return (_$9 !== "");
  })).join("\n");
});
var $d_Lcom_raquo_laminar_inputs_InputController$ = new $TypeData().i($c_Lcom_raquo_laminar_inputs_InputController$, "com.raquo.laminar.inputs.InputController$", ({
  dy: 1
}));
var $n_Lcom_raquo_laminar_inputs_InputController$;
function $m_Lcom_raquo_laminar_inputs_InputController$() {
  if ((!$n_Lcom_raquo_laminar_inputs_InputController$)) {
    $n_Lcom_raquo_laminar_inputs_InputController$ = new $c_Lcom_raquo_laminar_inputs_InputController$();
  }
  return $n_Lcom_raquo_laminar_inputs_InputController$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig(initialValue, prop, allowedEventProps, getDomValue, setDomValue) {
  this.hG = null;
  this.go = null;
  this.gn = null;
  this.kY = null;
  this.kZ = null;
  this.hG = initialValue;
  this.go = prop;
  this.gn = allowedEventProps;
  this.kY = getDomValue;
  this.kZ = setDomValue;
}
$p = $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig;
/** @constructor */
function $h_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig() {
}
$h_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig.prototype = $p;
var $d_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig = new $TypeData().i($c_Lcom_raquo_laminar_inputs_InputController$InputControllerConfig, "com.raquo.laminar.inputs.InputController$InputControllerConfig", ({
  dz: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_inserters_ChildInserter$() {
}
$p = $c_Lcom_raquo_laminar_inserters_ChildInserter$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inserters_ChildInserter$;
/** @constructor */
function $h_Lcom_raquo_laminar_inserters_ChildInserter$() {
}
$h_Lcom_raquo_laminar_inserters_ChildInserter$.prototype = $p;
$p.mE = (function(childSource, renderable, initialHooks) {
  return new $c_Lcom_raquo_laminar_inserters_DynamicInserter($m_s_None$(), true, new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((ctx, owner, hooks) => {
    if ((!ctx.dU)) {
      ctx.n1();
    }
    return $f_Lcom_raquo_airstream_core_BaseObservable__foreach__F1__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription(childSource, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ctx$2, maybeLastSeenChild) => ((newComponent) => {
      this.r2(maybeLastSeenChild.Y, newComponent, ctx$2, hooks);
      var ev$3 = newComponent;
      maybeLastSeenChild.Y = ev$3;
      ev$3 = null;
    }))(ctx, new $c_sr_ObjectRef((void 0)))), owner);
  })), initialHooks);
});
$p.r2 = (function(maybeLastSeenChild, newChildNode, ctx, hooks) {
  if ((!ctx.dU)) {
    ctx.n1();
  }
  var elem = ctx.dS;
  var elem$1 = 0;
  elem$1 = elem;
  var x$1 = (((maybeLastSeenChild === (void 0)) || $m_sr_BoxesRunTime$().k(maybeLastSeenChild.ao(), ctx.d1.ao().nextSibling)) ? maybeLastSeenChild : (void 0));
  if ((x$1 === (void 0))) {
    $m_Lcom_raquo_laminar_nodes_ParentNode$().pS(ctx.dT, newChildNode, ctx.d1, hooks);
  } else if (($m_Lcom_raquo_laminar_nodes_ParentNode$().nu(ctx.dT, x$1, newChildNode, hooks) || (x$1 === newChildNode))) {
    var ev$4 = ((elem$1 - 1) | 0);
    elem$1 = ev$4;
  }
  ctx.nt(newChildNode);
  ctx.d0.clear();
  ctx.d0.set(newChildNode.ao(), newChildNode);
  ctx.dS = 1;
});
var $d_Lcom_raquo_laminar_inserters_ChildInserter$ = new $TypeData().i($c_Lcom_raquo_laminar_inserters_ChildInserter$, "com.raquo.laminar.inserters.ChildInserter$", ({
  dA: 1
}));
var $n_Lcom_raquo_laminar_inserters_ChildInserter$;
function $m_Lcom_raquo_laminar_inserters_ChildInserter$() {
  if ((!$n_Lcom_raquo_laminar_inserters_ChildInserter$)) {
    $n_Lcom_raquo_laminar_inserters_ChildInserter$ = new $c_Lcom_raquo_laminar_inserters_ChildInserter$();
  }
  return $n_Lcom_raquo_laminar_inserters_ChildInserter$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_inserters_ChildTextInserter$() {
}
$p = $c_Lcom_raquo_laminar_inserters_ChildTextInserter$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inserters_ChildTextInserter$;
/** @constructor */
function $h_Lcom_raquo_laminar_inserters_ChildTextInserter$() {
}
$h_Lcom_raquo_laminar_inserters_ChildTextInserter$.prototype = $p;
$p.ow = (function(textSource, renderable) {
  return new $c_Lcom_raquo_laminar_inserters_DynamicInserter($m_s_None$(), false, new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((ctx, owner, _$1) => $f_Lcom_raquo_airstream_core_BaseObservable__foreach__F1__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription(textSource, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ctx$2, maybeTextNode) => ((newValue) => {
    var x = maybeTextNode.Y;
    if ((x === (void 0))) {
      var newTextNode = new $c_Lcom_raquo_laminar_nodes_TextNode(renderable.iF(newValue));
      this.r3(newTextNode, ctx$2);
      var ev$2 = newTextNode;
      maybeTextNode.Y = ev$2;
      ev$2 = null;
    } else {
      x.gt.textContent = renderable.iF(newValue);
    }
  }))(ctx, new $c_sr_ObjectRef((void 0)))), owner))), (void 0));
});
$p.r3 = (function(newTextNode, ctx) {
  $m_Lcom_raquo_laminar_nodes_ParentNode$().nu(ctx.dT, ctx.d1, newTextNode, (void 0));
  ctx.d1 = newTextNode;
  if (ctx.dU) {
    ctx.dU = false;
    ctx.nt(newTextNode);
    ctx.d0.clear();
    ctx.dS = 0;
  }
});
var $d_Lcom_raquo_laminar_inserters_ChildTextInserter$ = new $TypeData().i($c_Lcom_raquo_laminar_inserters_ChildTextInserter$, "com.raquo.laminar.inserters.ChildTextInserter$", ({
  dB: 1
}));
var $n_Lcom_raquo_laminar_inserters_ChildTextInserter$;
function $m_Lcom_raquo_laminar_inserters_ChildTextInserter$() {
  if ((!$n_Lcom_raquo_laminar_inserters_ChildTextInserter$)) {
    $n_Lcom_raquo_laminar_inserters_ChildTextInserter$ = new $c_Lcom_raquo_laminar_inserters_ChildTextInserter$();
  }
  return $n_Lcom_raquo_laminar_inserters_ChildTextInserter$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_inserters_InsertContext(parentNode, sentinelNode, strictMode, extraNodeCount, extraNodesMap) {
  this.dT = null;
  this.d1 = null;
  this.dU = false;
  this.dS = 0;
  this.d0 = null;
  this.dT = parentNode;
  this.d1 = sentinelNode;
  this.dU = strictMode;
  this.dS = extraNodeCount;
  this.d0 = extraNodesMap;
}
$p = $c_Lcom_raquo_laminar_inserters_InsertContext.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inserters_InsertContext;
/** @constructor */
function $h_Lcom_raquo_laminar_inserters_InsertContext() {
}
$h_Lcom_raquo_laminar_inserters_InsertContext.prototype = $p;
$p.n1 = (function() {
  if ((this.dU || (this.dS !== 0))) {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), ("forceSetStrictMode invoked when not allowed, inside parent = " + $m_Lcom_raquo_laminar_DomApi$().p2(this.dT.I)));
  }
  if ((this.d0 === null)) {
    this.d0 = new Map();
  }
  if ((!(!(!(this.d1.ao() instanceof Comment))))) {
    var contentNode = this.d1;
    var newSentinelNode = new $c_Lcom_raquo_laminar_nodes_CommentNode("");
    $m_Lcom_raquo_laminar_DomApi$().pR(this.dT.I, newSentinelNode.hW, contentNode.ao());
    this.d1 = newSentinelNode;
    this.dS = 1;
    this.d0.set(contentNode.ao(), contentNode);
  }
  this.dU = true;
});
$p.nt = (function(after) {
  var elem = this.dS;
  var elem$1 = 0;
  elem$1 = elem;
  while ((elem$1 > 0)) {
    var prevChildRef = after.ao().nextSibling;
    if ((prevChildRef === null)) {
      var ev$3 = 0;
      elem$1 = ev$3;
    } else {
      var maybePrevChild = this.d0.get(prevChildRef);
      if ((maybePrevChild === (void 0))) {
        var ev$4 = 0;
        elem$1 = ev$4;
      } else if ((maybePrevChild !== (void 0))) {
        $m_Lcom_raquo_laminar_nodes_ParentNode$().np(this.dT, maybePrevChild);
        var ev$5 = ((elem$1 - 1) | 0);
        elem$1 = ev$5;
      }
    }
  }
});
var $d_Lcom_raquo_laminar_inserters_InsertContext = new $TypeData().i($c_Lcom_raquo_laminar_inserters_InsertContext, "com.raquo.laminar.inserters.InsertContext", ({
  dE: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_inserters_InsertContext$() {
}
$p = $c_Lcom_raquo_laminar_inserters_InsertContext$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inserters_InsertContext$;
/** @constructor */
function $h_Lcom_raquo_laminar_inserters_InsertContext$() {
}
$h_Lcom_raquo_laminar_inserters_InsertContext$.prototype = $p;
$p.qH = (function(parentNode, strictMode, hooks) {
  var sentinelNode = new $c_Lcom_raquo_laminar_nodes_CommentNode("");
  $m_Lcom_raquo_laminar_nodes_ParentNode$().fK(parentNode, sentinelNode, hooks);
  return this.rb(parentNode, sentinelNode, strictMode);
});
$p.rb = (function(parentNode, sentinelNode, strictMode) {
  return new $c_Lcom_raquo_laminar_inserters_InsertContext(parentNode, sentinelNode, strictMode, 0, (strictMode ? new Map() : null));
});
var $d_Lcom_raquo_laminar_inserters_InsertContext$ = new $TypeData().i($c_Lcom_raquo_laminar_inserters_InsertContext$, "com.raquo.laminar.inserters.InsertContext$", ({
  dF: 1
}));
var $n_Lcom_raquo_laminar_inserters_InsertContext$;
function $m_Lcom_raquo_laminar_inserters_InsertContext$() {
  if ((!$n_Lcom_raquo_laminar_inserters_InsertContext$)) {
    $n_Lcom_raquo_laminar_inserters_InsertContext$ = new $c_Lcom_raquo_laminar_inserters_InsertContext$();
  }
  return $n_Lcom_raquo_laminar_inserters_InsertContext$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_keys_CompositeKey$() {
}
$p = $c_Lcom_raquo_laminar_keys_CompositeKey$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_CompositeKey$;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_CompositeKey$() {
}
$h_Lcom_raquo_laminar_keys_CompositeKey$.prototype = $p;
$p.nj = (function(items, separator) {
  if ((items === "")) {
    return $m_sci_Nil$();
  } else {
    var this$10 = $ct_sjs_js_WrappedArray__sjs_js_Array__(new $c_sjs_js_WrappedArray(), items.split(separator).filter(((_$1) => {
      $m_sc_StringOps$();
      return (_$1 !== "");
    })));
    $m_sci_List$();
    return $m_sci_Nil$().eW(this$10);
  }
});
var $d_Lcom_raquo_laminar_keys_CompositeKey$ = new $TypeData().i($c_Lcom_raquo_laminar_keys_CompositeKey$, "com.raquo.laminar.keys.CompositeKey$", ({
  dI: 1
}));
var $n_Lcom_raquo_laminar_keys_CompositeKey$;
function $m_Lcom_raquo_laminar_keys_CompositeKey$() {
  if ((!$n_Lcom_raquo_laminar_keys_CompositeKey$)) {
    $n_Lcom_raquo_laminar_keys_CompositeKey$ = new $c_Lcom_raquo_laminar_keys_CompositeKey$();
  }
  return $n_Lcom_raquo_laminar_keys_CompositeKey$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_keys_EventProcessor(eventProp, shouldUseCapture, shouldBePassive, processor) {
  this.bY = null;
  this.fg = false;
  this.ff = false;
  this.fe = null;
  this.bY = eventProp;
  this.fg = shouldUseCapture;
  this.ff = shouldBePassive;
  this.fe = processor;
}
$p = $c_Lcom_raquo_laminar_keys_EventProcessor.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_EventProcessor;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_EventProcessor() {
}
$h_Lcom_raquo_laminar_keys_EventProcessor.prototype = $p;
$p.q7 = (function(project) {
  var newProcessor = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ev) => {
    var this$2 = this.fe.b(ev);
    return (this$2.c() ? $m_s_None$() : new $c_s_Some(project.b(this$2.y())));
  }));
  return new $c_Lcom_raquo_laminar_keys_EventProcessor(this.bY, this.fg, this.ff, newProcessor);
});
$p.qe = (function() {
  var newProcessor = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ev) => {
    var this$2 = this.fe.b(ev);
    if (this$2.c()) {
      return $m_s_None$();
    } else {
      this$2.y();
      var x = $m_Lcom_raquo_laminar_DomApi$().j4(ev.target);
      return new $c_s_Some(((x === (void 0)) ? "" : x));
    }
  }));
  return new $c_Lcom_raquo_laminar_keys_EventProcessor(this.bY, this.fg, this.ff, newProcessor);
});
$p.qs = (function(f) {
  var newProcessor = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ev) => {
    var result = this.fe.b(ev);
    if (result.c()) {
      f.b(ev);
    }
    return result;
  }));
  return new $c_Lcom_raquo_laminar_keys_EventProcessor(this.bY, this.fg, this.ff, newProcessor);
});
var $d_Lcom_raquo_laminar_keys_EventProcessor = new $TypeData().i($c_Lcom_raquo_laminar_keys_EventProcessor, "com.raquo.laminar.keys.EventProcessor", ({
  dN: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_EventProcessor$() {
}
$p = $c_Lcom_raquo_laminar_keys_EventProcessor$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_EventProcessor$;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_EventProcessor$() {
}
$h_Lcom_raquo_laminar_keys_EventProcessor$.prototype = $p;
$p.mT = (function(eventProp, shouldUseCapture, shouldBePassive) {
  return new $c_Lcom_raquo_laminar_keys_EventProcessor(eventProp, shouldUseCapture, shouldBePassive, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$14) => new $c_s_Some(_$14))));
});
var $d_Lcom_raquo_laminar_keys_EventProcessor$ = new $TypeData().i($c_Lcom_raquo_laminar_keys_EventProcessor$, "com.raquo.laminar.keys.EventProcessor$", ({
  dO: 1
}));
var $n_Lcom_raquo_laminar_keys_EventProcessor$;
function $m_Lcom_raquo_laminar_keys_EventProcessor$() {
  if ((!$n_Lcom_raquo_laminar_keys_EventProcessor$)) {
    $n_Lcom_raquo_laminar_keys_EventProcessor$ = new $c_Lcom_raquo_laminar_keys_EventProcessor$();
  }
  return $n_Lcom_raquo_laminar_keys_EventProcessor$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_keys_Key() {
}
$p = $c_Lcom_raquo_laminar_keys_Key.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_Key;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_Key() {
}
$h_Lcom_raquo_laminar_keys_Key.prototype = $p;
/** @constructor */
function $c_Lcom_raquo_laminar_keys_SvgAttr$() {
  this.nP = null;
  this.nQ = null;
  this.nR = null;
  this.nS = null;
  this.nP = "http://www.w3.org/2000/svg";
  this.nQ = "http://www.w3.org/1999/xlink";
  this.nR = "http://www.w3.org/XML/1998/namespace";
  this.nS = "http://www.w3.org/2000/xmlns/";
}
$p = $c_Lcom_raquo_laminar_keys_SvgAttr$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_SvgAttr$;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_SvgAttr$() {
}
$h_Lcom_raquo_laminar_keys_SvgAttr$.prototype = $p;
$p.ql = (function(namespace) {
  switch (namespace) {
    case "svg": {
      return "http://www.w3.org/2000/svg";
      break;
    }
    case "xlink": {
      return "http://www.w3.org/1999/xlink";
      break;
    }
    case "xml": {
      return "http://www.w3.org/XML/1998/namespace";
      break;
    }
    case "xmlns": {
      return "http://www.w3.org/2000/xmlns/";
      break;
    }
    default: {
      throw new $c_s_MatchError(namespace);
    }
  }
});
var $d_Lcom_raquo_laminar_keys_SvgAttr$ = new $TypeData().i($c_Lcom_raquo_laminar_keys_SvgAttr$, "com.raquo.laminar.keys.SvgAttr$", ({
  dT: 1
}));
var $n_Lcom_raquo_laminar_keys_SvgAttr$;
function $m_Lcom_raquo_laminar_keys_SvgAttr$() {
  if ((!$n_Lcom_raquo_laminar_keys_SvgAttr$)) {
    $n_Lcom_raquo_laminar_keys_SvgAttr$ = new $c_Lcom_raquo_laminar_keys_SvgAttr$();
  }
  return $n_Lcom_raquo_laminar_keys_SvgAttr$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_lifecycle_MountContext(thisNode, owner) {
  this.l6 = null;
  this.fi = null;
  this.l6 = thisNode;
  this.fi = owner;
}
$p = $c_Lcom_raquo_laminar_lifecycle_MountContext.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_lifecycle_MountContext;
/** @constructor */
function $h_Lcom_raquo_laminar_lifecycle_MountContext() {
}
$h_Lcom_raquo_laminar_lifecycle_MountContext.prototype = $p;
var $d_Lcom_raquo_laminar_lifecycle_MountContext = new $TypeData().i($c_Lcom_raquo_laminar_lifecycle_MountContext, "com.raquo.laminar.lifecycle.MountContext", ({
  dU: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_Binder$() {
}
$p = $c_Lcom_raquo_laminar_modifiers_Binder$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_Binder$;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_Binder$() {
}
$h_Lcom_raquo_laminar_modifiers_Binder$.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_Binder$ = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_Binder$, "com.raquo.laminar.modifiers.Binder$", ({
  dV: 1
}));
var $n_Lcom_raquo_laminar_modifiers_Binder$;
function $m_Lcom_raquo_laminar_modifiers_Binder$() {
  if ((!$n_Lcom_raquo_laminar_modifiers_Binder$)) {
    $n_Lcom_raquo_laminar_modifiers_Binder$ = new $c_Lcom_raquo_laminar_modifiers_Binder$();
  }
  return $n_Lcom_raquo_laminar_modifiers_Binder$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_Modifier$() {
  this.nT = null;
  $n_Lcom_raquo_laminar_modifiers_Modifier$ = this;
  this.nT = new $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$1();
}
$p = $c_Lcom_raquo_laminar_modifiers_Modifier$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_Modifier$;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_Modifier$() {
}
$h_Lcom_raquo_laminar_modifiers_Modifier$.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_Modifier$ = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_Modifier$, "com.raquo.laminar.modifiers.Modifier$", ({
  e1: 1
}));
var $n_Lcom_raquo_laminar_modifiers_Modifier$;
function $m_Lcom_raquo_laminar_modifiers_Modifier$() {
  if ((!$n_Lcom_raquo_laminar_modifiers_Modifier$)) {
    $n_Lcom_raquo_laminar_modifiers_Modifier$ = new $c_Lcom_raquo_laminar_modifiers_Modifier$();
  }
  return $n_Lcom_raquo_laminar_modifiers_Modifier$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_RenderableNode$() {
  this.hU = null;
  $n_Lcom_raquo_laminar_modifiers_RenderableNode$ = this;
  this.hU = new $c_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1();
}
$p = $c_Lcom_raquo_laminar_modifiers_RenderableNode$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_RenderableNode$;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_RenderableNode$() {
}
$h_Lcom_raquo_laminar_modifiers_RenderableNode$.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_RenderableNode$ = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_RenderableNode$, "com.raquo.laminar.modifiers.RenderableNode$", ({
  e5: 1
}));
var $n_Lcom_raquo_laminar_modifiers_RenderableNode$;
function $m_Lcom_raquo_laminar_modifiers_RenderableNode$() {
  if ((!$n_Lcom_raquo_laminar_modifiers_RenderableNode$)) {
    $n_Lcom_raquo_laminar_modifiers_RenderableNode$ = new $c_Lcom_raquo_laminar_modifiers_RenderableNode$();
  }
  return $n_Lcom_raquo_laminar_modifiers_RenderableNode$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_RenderableText$() {
  this.es = null;
  this.lf = null;
  this.lg = null;
  $n_Lcom_raquo_laminar_modifiers_RenderableText$ = this;
  this.es = new $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((x) => x)), $m_Lcom_raquo_laminar_modifiers_RenderableText$());
  this.lf = new $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => ("" + (_$1 | 0)))), $m_Lcom_raquo_laminar_modifiers_RenderableText$());
  new $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$2) => ("" + (+_$2)))), $m_Lcom_raquo_laminar_modifiers_RenderableText$());
  new $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$3) => ("" + (!(!_$3))))), $m_Lcom_raquo_laminar_modifiers_RenderableText$());
  this.lg = new $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$4) => _$4.r5())), $m_Lcom_raquo_laminar_modifiers_RenderableText$());
}
$p = $c_Lcom_raquo_laminar_modifiers_RenderableText$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_RenderableText$;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_RenderableText$() {
}
$h_Lcom_raquo_laminar_modifiers_RenderableText$.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_RenderableText$ = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_RenderableText$, "com.raquo.laminar.modifiers.RenderableText$", ({
  ea: 1
}));
var $n_Lcom_raquo_laminar_modifiers_RenderableText$;
function $m_Lcom_raquo_laminar_modifiers_RenderableText$() {
  if ((!$n_Lcom_raquo_laminar_modifiers_RenderableText$)) {
    $n_Lcom_raquo_laminar_modifiers_RenderableText$ = new $c_Lcom_raquo_laminar_modifiers_RenderableText$();
  }
  return $n_Lcom_raquo_laminar_modifiers_RenderableText$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_ParentNode$() {
}
$p = $c_Lcom_raquo_laminar_nodes_ParentNode$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_ParentNode$;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_ParentNode$() {
}
$h_Lcom_raquo_laminar_nodes_ParentNode$.prototype = $p;
$p.fK = (function(parent, child, hooks) {
  var nextParent = new $c_s_Some(parent);
  child.ek(nextParent);
  if ((hooks !== (void 0))) {
    hooks.no(parent, child);
  }
  var appended = $m_Lcom_raquo_laminar_DomApi$().ov(parent.ao(), child.ao());
  if (appended) {
    child.eh(nextParent);
  }
  return appended;
});
$p.np = (function(parent, child) {
  var removed = false;
  if ($m_sr_BoxesRunTime$().k(child.ao().parentNode, parent.ao())) {
    child.ek($m_s_None$());
    removed = $m_Lcom_raquo_laminar_DomApi$().qB(parent.ao(), child.ao());
    child.eh($m_s_None$());
  }
  return removed;
});
$p.pS = (function(parent, newChild, referenceChild, hooks) {
  var nextParent = new $c_s_Some(parent);
  newChild.ek(nextParent);
  if ((hooks !== (void 0))) {
    hooks.no(parent, newChild);
  }
  var inserted = $m_Lcom_raquo_laminar_DomApi$().pQ(parent.ao(), newChild.ao(), referenceChild.ao());
  newChild.eh(nextParent);
  return inserted;
});
$p.nu = (function(parent, oldChild, newChild, hooks) {
  var replaced = false;
  if ((oldChild !== newChild)) {
    if (oldChild.iI().be(parent)) {
      var newChildNextParent = new $c_s_Some(parent);
      oldChild.ek($m_s_None$());
      newChild.ek(newChildNextParent);
      if ((hooks !== (void 0))) {
        hooks.no(parent, newChild);
      }
      replaced = $m_Lcom_raquo_laminar_DomApi$().qF(parent.ao(), newChild.ao(), oldChild.ao());
      if (replaced) {
        oldChild.eh($m_s_None$());
        newChild.eh(newChildNextParent);
      }
    }
  }
  return replaced;
});
var $d_Lcom_raquo_laminar_nodes_ParentNode$ = new $TypeData().i($c_Lcom_raquo_laminar_nodes_ParentNode$, "com.raquo.laminar.nodes.ParentNode$", ({
  ed: 1
}));
var $n_Lcom_raquo_laminar_nodes_ParentNode$;
function $m_Lcom_raquo_laminar_nodes_ParentNode$() {
  if ((!$n_Lcom_raquo_laminar_nodes_ParentNode$)) {
    $n_Lcom_raquo_laminar_nodes_ParentNode$ = new $c_Lcom_raquo_laminar_nodes_ParentNode$();
  }
  return $n_Lcom_raquo_laminar_nodes_ParentNode$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_ReactiveElement$() {
}
$p = $c_Lcom_raquo_laminar_nodes_ReactiveElement$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_ReactiveElement$;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_ReactiveElement$() {
}
$h_Lcom_raquo_laminar_nodes_ReactiveElement$.prototype = $p;
$p.ra = (function(element, subscribe) {
  return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => subscribe.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element, owner)))), true);
});
var $d_Lcom_raquo_laminar_nodes_ReactiveElement$ = new $TypeData().i($c_Lcom_raquo_laminar_nodes_ReactiveElement$, "com.raquo.laminar.nodes.ReactiveElement$", ({
  ef: 1
}));
var $n_Lcom_raquo_laminar_nodes_ReactiveElement$;
function $m_Lcom_raquo_laminar_nodes_ReactiveElement$() {
  if ((!$n_Lcom_raquo_laminar_nodes_ReactiveElement$)) {
    $n_Lcom_raquo_laminar_nodes_ReactiveElement$ = new $c_Lcom_raquo_laminar_nodes_ReactiveElement$();
  }
  return $n_Lcom_raquo_laminar_nodes_ReactiveElement$;
}
function $p_Lcom_raquo_laminar_receivers_ChildOptionReceiver$__emptyNode$lzyINIT1$1__sr_LazyRef__Lcom_raquo_laminar_nodes_CommentNode($thiz, emptyNode$lzy1$1) {
  if ((emptyNode$lzy1$1 === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  return (emptyNode$lzy1$1.gI ? emptyNode$lzy1$1.gJ : emptyNode$lzy1$1.pO(new $c_Lcom_raquo_laminar_nodes_CommentNode("")));
}
function $p_Lcom_raquo_laminar_receivers_ChildOptionReceiver$__emptyNode$1__sr_LazyRef__Lcom_raquo_laminar_nodes_CommentNode($thiz, emptyNode$lzy1$2) {
  return (emptyNode$lzy1$2.gI ? emptyNode$lzy1$2.gJ : $p_Lcom_raquo_laminar_receivers_ChildOptionReceiver$__emptyNode$lzyINIT1$1__sr_LazyRef__Lcom_raquo_laminar_nodes_CommentNode($thiz, emptyNode$lzy1$2));
}
/** @constructor */
function $c_Lcom_raquo_laminar_receivers_ChildOptionReceiver$() {
}
$p = $c_Lcom_raquo_laminar_receivers_ChildOptionReceiver$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_receivers_ChildOptionReceiver$;
/** @constructor */
function $h_Lcom_raquo_laminar_receivers_ChildOptionReceiver$() {
}
$h_Lcom_raquo_laminar_receivers_ChildOptionReceiver$.prototype = $p;
$p.oc = (function(maybeChildSource) {
  var emptyNode$lzy1 = new $c_sr_LazyRef();
  $m_Lcom_raquo_laminar_api_package$();
  return $m_Lcom_raquo_laminar_inserters_ChildInserter$().mE(new $c_Lcom_raquo_airstream_misc_MapSignal(maybeChildSource.cd(), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((emptyNode$lzy1$2) => ((_$1) => (_$1.c() ? $p_Lcom_raquo_laminar_receivers_ChildOptionReceiver$__emptyNode$1__sr_LazyRef__Lcom_raquo_laminar_nodes_CommentNode(this, emptyNode$lzy1$2) : _$1.y())))(emptyNode$lzy1)), $m_s_None$()), $m_Lcom_raquo_laminar_modifiers_RenderableNode$().hU, (void 0));
});
var $d_Lcom_raquo_laminar_receivers_ChildOptionReceiver$ = new $TypeData().i($c_Lcom_raquo_laminar_receivers_ChildOptionReceiver$, "com.raquo.laminar.receivers.ChildOptionReceiver$", ({
  ej: 1
}));
var $n_Lcom_raquo_laminar_receivers_ChildOptionReceiver$;
function $m_Lcom_raquo_laminar_receivers_ChildOptionReceiver$() {
  if ((!$n_Lcom_raquo_laminar_receivers_ChildOptionReceiver$)) {
    $n_Lcom_raquo_laminar_receivers_ChildOptionReceiver$ = new $c_Lcom_raquo_laminar_receivers_ChildOptionReceiver$();
  }
  return $n_Lcom_raquo_laminar_receivers_ChildOptionReceiver$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_receivers_ChildReceiver$() {
  this.nU = null;
  this.nV = null;
  $n_Lcom_raquo_laminar_receivers_ChildReceiver$ = this;
  this.nU = $m_Lcom_raquo_laminar_receivers_ChildOptionReceiver$();
  this.nV = $m_Lcom_raquo_laminar_receivers_ChildTextReceiver$();
}
$p = $c_Lcom_raquo_laminar_receivers_ChildReceiver$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_receivers_ChildReceiver$;
/** @constructor */
function $h_Lcom_raquo_laminar_receivers_ChildReceiver$() {
}
$h_Lcom_raquo_laminar_receivers_ChildReceiver$.prototype = $p;
var $d_Lcom_raquo_laminar_receivers_ChildReceiver$ = new $TypeData().i($c_Lcom_raquo_laminar_receivers_ChildReceiver$, "com.raquo.laminar.receivers.ChildReceiver$", ({
  ek: 1
}));
var $n_Lcom_raquo_laminar_receivers_ChildReceiver$;
function $m_Lcom_raquo_laminar_receivers_ChildReceiver$() {
  if ((!$n_Lcom_raquo_laminar_receivers_ChildReceiver$)) {
    $n_Lcom_raquo_laminar_receivers_ChildReceiver$ = new $c_Lcom_raquo_laminar_receivers_ChildReceiver$();
  }
  return $n_Lcom_raquo_laminar_receivers_ChildReceiver$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_receivers_ChildTextReceiver$() {
}
$p = $c_Lcom_raquo_laminar_receivers_ChildTextReceiver$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_receivers_ChildTextReceiver$;
/** @constructor */
function $h_Lcom_raquo_laminar_receivers_ChildTextReceiver$() {
}
$h_Lcom_raquo_laminar_receivers_ChildTextReceiver$.prototype = $p;
$p.oa = (function(textSource, renderable) {
  var x$2 = $m_Lcom_raquo_laminar_modifiers_RenderableText$().lg;
  if (((renderable === null) ? (x$2 === null) : (renderable === x$2))) {
    return $m_Lcom_raquo_laminar_inserters_ChildInserter$().mE(textSource.cd(), $m_Lcom_raquo_laminar_modifiers_RenderableNode$().hU, (void 0));
  } else {
    return $m_Lcom_raquo_laminar_inserters_ChildTextInserter$().ow(textSource.cd(), renderable);
  }
});
var $d_Lcom_raquo_laminar_receivers_ChildTextReceiver$ = new $TypeData().i($c_Lcom_raquo_laminar_receivers_ChildTextReceiver$, "com.raquo.laminar.receivers.ChildTextReceiver$", ({
  el: 1
}));
var $n_Lcom_raquo_laminar_receivers_ChildTextReceiver$;
function $m_Lcom_raquo_laminar_receivers_ChildTextReceiver$() {
  if ((!$n_Lcom_raquo_laminar_receivers_ChildTextReceiver$)) {
    $n_Lcom_raquo_laminar_receivers_ChildTextReceiver$ = new $c_Lcom_raquo_laminar_receivers_ChildTextReceiver$();
  }
  return $n_Lcom_raquo_laminar_receivers_ChildTextReceiver$;
}
function $p_jl_StackTrace$__normalizedLinesToStackTrace__O__Ajl_StackTraceElement($thiz, lines) {
  var NormalizedFrameLine = $m_jl_StackTrace$StringRE$().cb("^([^@]*)@(.*?):([0-9]+)(?::([0-9]+))?$");
  var trace = [];
  var i = 0;
  while ((i < (lines.length | 0))) {
    var line = lines[i];
    if ((line !== "")) {
      var mtch = NormalizedFrameLine.exec(line);
      if ((mtch !== null)) {
        var classAndMethodName = $p_jl_StackTrace$__extractClassMethod__T__O($thiz, mtch[1]);
        var $x_5 = classAndMethodName[0];
        var $x_4 = classAndMethodName[1];
        var $x_3 = mtch[2];
        var x$2 = mtch[3];
        var $x_2 = parseInt(x$2);
        var x$3 = mtch[4];
        var $x_1 = trace.push(new $c_jl_StackTraceElement($x_5, $x_4, $x_3, ($x_2 | 0), ((x$3 !== (void 0)) ? (parseInt(x$3) | 0) : (-1))));
      } else {
        (trace.push(new $c_jl_StackTraceElement("<jscode>", line, null, (-1), (-1))) | 0);
      }
    }
    i = ((1 + i) | 0);
  }
  var len = (trace.length | 0);
  var result = new ($d_jl_StackTraceElement.r().C)(len);
  i = 0;
  while ((i < len)) {
    result.a[i] = trace[i];
    i = ((1 + i) | 0);
  }
  return result;
}
function $p_jl_StackTrace$__extractClassMethod__T__O($thiz, functionName) {
  var PatBC = $m_jl_StackTrace$StringRE$().cb("^(?:Object\\.|\\[object Object\\]\\.|Module\\.)?\\$[bc]_([^\\.]+)(?:\\.prototype)?\\.([^\\.]+)$");
  var PatS = $m_jl_StackTrace$StringRE$().cb("^(?:Object\\.|\\[object Object\\]\\.|Module\\.)?\\$(?:ps?|s|f)_((?:_[^_]|[^_])+)__([^\\.]+)$");
  var PatCT = $m_jl_StackTrace$StringRE$().cb("^(?:Object\\.|\\[object Object\\]\\.|Module\\.)?\\$ct_((?:_[^_]|[^_])+)__([^\\.]*)$");
  var PatN = $m_jl_StackTrace$StringRE$().cb("^new (?:Object\\.|\\[object Object\\]\\.|Module\\.)?\\$c_([^\\.]+)$");
  var PatM = $m_jl_StackTrace$StringRE$().cb("^(?:Object\\.|\\[object Object\\]\\.|Module\\.)?\\$m_([^\\.]+)$");
  var matchBC = PatBC.exec(functionName);
  var matchBCOrS = ((matchBC !== null) ? matchBC : PatS.exec(functionName));
  if ((matchBCOrS !== null)) {
    return [$p_jl_StackTrace$__decodeClassName__T__T($thiz, matchBCOrS[1]), $p_jl_StackTrace$__decodeMethodName__T__T($thiz, matchBCOrS[2])];
  } else {
    var matchCT = PatCT.exec(functionName);
    var matchCTOrN = ((matchCT !== null) ? matchCT : PatN.exec(functionName));
    if ((matchCTOrN !== null)) {
      return [$p_jl_StackTrace$__decodeClassName__T__T($thiz, matchCTOrN[1]), "<init>"];
    } else {
      var matchM = PatM.exec(functionName);
      return ((matchM !== null) ? [$p_jl_StackTrace$__decodeClassName__T__T($thiz, matchM[1]), "<clinit>"] : ["<jscode>", functionName]);
    }
  }
}
function $p_jl_StackTrace$__decodeClassName__T__T($thiz, encodedName) {
  var dict = $p_jl_StackTrace$__decompressedClasses__O($thiz);
  if ((!(!$m_jl_Utils$Cache$().i7.call(dict, encodedName)))) {
    var dict$1 = $p_jl_StackTrace$__decompressedClasses__O($thiz);
    var base = dict$1[encodedName];
  } else {
    var base = $p_jl_StackTrace$__loop$1__I__T__T($thiz, 0, encodedName);
  }
  var this$3 = base.split("_").join(".");
  return this$3.split("\uff3f").join("_");
}
function $p_jl_StackTrace$__decompressedClasses$lzycompute__O($thiz) {
  if (((((1 & $thiz.bL) << 24) >> 24) === 0)) {
    var dict = ({});
    dict.O = "java_lang_Object";
    dict.T = "java_lang_String";
    var index = 0;
    while ((index <= 22)) {
      if ((index >= 2)) {
        var key = ("T" + index);
        var value = ("scala_Tuple" + index);
        dict[key] = value;
      }
      var key$1 = ("F" + index);
      var value$1 = ("scala_Function" + index);
      dict[key$1] = value$1;
      index = ((1 + index) | 0);
    }
    $thiz.i4 = dict;
    $thiz.bL = (((1 | $thiz.bL) << 24) >> 24);
  }
  return $thiz.i4;
}
function $p_jl_StackTrace$__decompressedClasses__O($thiz) {
  return (((((1 & $thiz.bL) << 24) >> 24) === 0) ? $p_jl_StackTrace$__decompressedClasses$lzycompute__O($thiz) : $thiz.i4);
}
function $p_jl_StackTrace$__decompressedPrefixes$lzycompute__O($thiz) {
  if (((((2 & $thiz.bL) << 24) >> 24) === 0)) {
    var dict = ({});
    dict.sjsr_ = "scala_scalajs_runtime_";
    dict.sjs_ = "scala_scalajs_";
    dict.sci_ = "scala_collection_immutable_";
    dict.scm_ = "scala_collection_mutable_";
    dict.scg_ = "scala_collection_generic_";
    dict.sc_ = "scala_collection_";
    dict.sr_ = "scala_runtime_";
    dict.s_ = "scala_";
    dict.jl_ = "java_lang_";
    dict.ju_ = "java_util_";
    $thiz.i5 = dict;
    $thiz.bL = (((2 | $thiz.bL) << 24) >> 24);
  }
  return $thiz.i5;
}
function $p_jl_StackTrace$__decompressedPrefixes__O($thiz) {
  return (((((2 & $thiz.bL) << 24) >> 24) === 0) ? $p_jl_StackTrace$__decompressedPrefixes$lzycompute__O($thiz) : $thiz.i5);
}
function $p_jl_StackTrace$__compressedPrefixes$lzycompute__O($thiz) {
  if (((((4 & $thiz.bL) << 24) >> 24) === 0)) {
    $thiz.i3 = Object.keys($p_jl_StackTrace$__decompressedPrefixes__O($thiz));
    $thiz.bL = (((4 | $thiz.bL) << 24) >> 24);
  }
  return $thiz.i3;
}
function $p_jl_StackTrace$__compressedPrefixes__O($thiz) {
  return (((((4 & $thiz.bL) << 24) >> 24) === 0) ? $p_jl_StackTrace$__compressedPrefixes$lzycompute__O($thiz) : $thiz.i3);
}
function $p_jl_StackTrace$__decodeMethodName__T__T($thiz, encodedName) {
  if ((!(!encodedName.startsWith("init___")))) {
    return "<init>";
  } else {
    var methodNameLen = (encodedName.indexOf("__") | 0);
    return ((methodNameLen < 0) ? encodedName : encodedName.substring(0, methodNameLen));
  }
}
function $p_jl_StackTrace$__normalizeStackTraceLines__O__O($thiz, e) {
  return ((!(!(!(!(!e))))) ? [] : ((!(!(!(!(e.arguments && e.stack))))) ? $p_jl_StackTrace$__extractChrome__O__O($thiz, e) : ((!(!(!(!(e.stack && e.sourceURL))))) ? $p_jl_StackTrace$__extractSafari__O__O($thiz, e) : ((!(!(!(!(e.stack && e.number))))) ? $p_jl_StackTrace$__extractIE__O__O($thiz, e) : ((!(!(!(!(e.stack && e.fileName))))) ? $p_jl_StackTrace$__extractFirefox__O__O($thiz, e) : ((!(!(!(!(e.message && e["opera#sourceloc"]))))) ? ((!(!(!(!(!e.stacktrace))))) ? $p_jl_StackTrace$__extractOpera9__O__O($thiz, e) : ((!(!(!(!((e.message.indexOf("\n") > (-1.0)) && (e.message.split("\n").length > e.stacktrace.split("\n").length)))))) ? $p_jl_StackTrace$__extractOpera9__O__O($thiz, e) : $p_jl_StackTrace$__extractOpera10a__O__O($thiz, e))) : ((!(!(!(!((e.message && e.stack) && e.stacktrace))))) ? ((!(!(!(!(e.stacktrace.indexOf("called from line") < 0.0))))) ? $p_jl_StackTrace$__extractOpera10b__O__O($thiz, e) : $p_jl_StackTrace$__extractOpera11__O__O($thiz, e)) : ((!(!(!(!(e.stack && (!e.fileName)))))) ? $p_jl_StackTrace$__extractChrome__O__O($thiz, e) : $p_jl_StackTrace$__extractOther__O__O($thiz, e)))))))));
}
function $p_jl_StackTrace$__extractChrome__O__O($thiz, e) {
  return (e.stack + "\n").replace($m_jl_StackTrace$StringRE$().cb("^[\\s\\S]+?\\s+at\\s+"), " at ").replace($m_jl_StackTrace$StringRE$().bB("^\\s+(at eval )?at\\s+", "gm"), "").replace($m_jl_StackTrace$StringRE$().bB("^([^\\(]+?)([\\n])", "gm"), "{anonymous}() ($1)$2").replace($m_jl_StackTrace$StringRE$().bB("^Object.<anonymous>\\s*\\(([^\\)]+)\\)", "gm"), "{anonymous}() ($1)").replace($m_jl_StackTrace$StringRE$().bB("^([^\\(]+|\\{anonymous\\}\\(\\)) \\((.+)\\)$", "gm"), "$1@$2").split("\n").slice(0, (-1));
}
function $p_jl_StackTrace$__extractFirefox__O__O($thiz, e) {
  return e.stack.replace($m_jl_StackTrace$StringRE$().bB("(?:\\n@:0)?\\s+$", "m"), "").replace($m_jl_StackTrace$StringRE$().bB("^(?:\\((\\S*)\\))?@", "gm"), "{anonymous}($1)@").split("\n");
}
function $p_jl_StackTrace$__extractIE__O__O($thiz, e) {
  var qual$1 = e.stack.replace($m_jl_StackTrace$StringRE$().bB("^\\s*at\\s+(.*)$", "gm"), "$1").replace($m_jl_StackTrace$StringRE$().bB("^Anonymous function\\s+", "gm"), "{anonymous}() ").replace($m_jl_StackTrace$StringRE$().bB("^([^\\(]+|\\{anonymous\\}\\(\\))\\s+\\((.+)\\)$", "gm"), "$1@$2").split("\n");
  return qual$1.slice(1);
}
function $p_jl_StackTrace$__extractSafari__O__O($thiz, e) {
  return e.stack.replace($m_jl_StackTrace$StringRE$().bB("\\[native code\\]\\n", "m"), "").replace($m_jl_StackTrace$StringRE$().bB("^(?=\\w+Error\\:).*$\\n", "m"), "").replace($m_jl_StackTrace$StringRE$().bB("^@", "gm"), "{anonymous}()@").split("\n");
}
function $p_jl_StackTrace$__extractOpera9__O__O($thiz, e) {
  var lineRE = $m_jl_StackTrace$StringRE$().bB("Line (\\d+).*script (?:in )?(\\S+)", "i");
  var lines = e.message.split("\n");
  var result = [];
  var i = 2;
  var len = (lines.length | 0);
  while ((i < len)) {
    var mtch = lineRE.exec(lines[i]);
    if ((mtch !== null)) {
      (result.push(((("{anonymous}()@" + mtch[2]) + ":") + mtch[1])) | 0);
    }
    i = ((2 + i) | 0);
  }
  return result;
}
function $p_jl_StackTrace$__extractOpera10a__O__O($thiz, e) {
  var lineRE = $m_jl_StackTrace$StringRE$().bB("Line (\\d+).*script (?:in )?(\\S+)(?:: In function (\\S+))?$", "i");
  var lines = e.stacktrace.split("\n");
  var result = [];
  var i = 0;
  var len = (lines.length | 0);
  while ((i < len)) {
    var mtch = lineRE.exec(lines[i]);
    if ((mtch !== null)) {
      var x = mtch[3];
      var fnName = ((x !== (void 0)) ? x : "{anonymous}");
      (result.push(((((fnName + "()@") + mtch[2]) + ":") + mtch[1])) | 0);
    }
    i = ((2 + i) | 0);
  }
  return result;
}
function $p_jl_StackTrace$__extractOpera10b__O__O($thiz, e) {
  var lineRE = $m_jl_StackTrace$StringRE$().cb("^(.*)@(.+):(\\d+)$");
  var lines = e.stacktrace.split("\n");
  var result = [];
  var i = 0;
  var len = (lines.length | 0);
  while ((i < len)) {
    var mtch = lineRE.exec(lines[i]);
    if ((mtch !== null)) {
      var x = mtch[1];
      var fnName = ((x !== (void 0)) ? (x + "()") : "global code");
      (result.push(((((fnName + "@") + mtch[2]) + ":") + mtch[3])) | 0);
    }
    i = ((1 + i) | 0);
  }
  return result;
}
function $p_jl_StackTrace$__extractOpera11__O__O($thiz, e) {
  var lineRE = $m_jl_StackTrace$StringRE$().cb("^.*line (\\d+), column (\\d+)(?: in (.+))? in (\\S+):$");
  var lines = e.stacktrace.split("\n");
  var result = [];
  var i = 0;
  var len = (lines.length | 0);
  while ((i < len)) {
    var mtch = lineRE.exec(lines[i]);
    if ((mtch !== null)) {
      var location = ((((mtch[4] + ":") + mtch[1]) + ":") + mtch[2]);
      var x$3 = mtch[2];
      var fnName0 = ((x$3 !== (void 0)) ? x$3 : "global code");
      var fnName = fnName0.replace($m_jl_StackTrace$StringRE$().cb("<anonymous function: (\\S+)>"), "$1").replace($m_jl_StackTrace$StringRE$().cb("<anonymous function>"), "{anonymous}");
      (result.push(((fnName + "@") + location)) | 0);
    }
    i = ((2 + i) | 0);
  }
  return result;
}
function $p_jl_StackTrace$__extractOther__O__O($thiz, e) {
  return [];
}
function $p_jl_StackTrace$__loop$1__I__T__T($thiz, i, encodedName$1) {
  while (true) {
    if ((i < ($p_jl_StackTrace$__compressedPrefixes__O($thiz).length | 0))) {
      var prefix = $p_jl_StackTrace$__compressedPrefixes__O($thiz)[i];
      if ((!(!encodedName$1.startsWith(prefix)))) {
        var dict = $p_jl_StackTrace$__decompressedPrefixes__O($thiz);
        return (("" + dict[prefix]) + encodedName$1.substring(prefix.length));
      } else {
        i = ((1 + i) | 0);
      }
    } else {
      return ((!(!encodedName$1.startsWith("L"))) ? encodedName$1.substring(1) : encodedName$1);
    }
  }
}
/** @constructor */
function $c_jl_StackTrace$() {
  this.i4 = null;
  this.i5 = null;
  this.i3 = null;
  this.bL = 0;
}
$p = $c_jl_StackTrace$.prototype = new $h_O();
$p.constructor = $c_jl_StackTrace$;
/** @constructor */
function $h_jl_StackTrace$() {
}
$h_jl_StackTrace$.prototype = $p;
$p.pf = (function(jsError) {
  return $p_jl_StackTrace$__normalizedLinesToStackTrace__O__Ajl_StackTraceElement(this, $p_jl_StackTrace$__normalizeStackTraceLines__O__O(this, jsError));
});
var $d_jl_StackTrace$ = new $TypeData().i($c_jl_StackTrace$, "java.lang.StackTrace$", ({
  eL: 1
}));
var $n_jl_StackTrace$;
function $m_jl_StackTrace$() {
  if ((!$n_jl_StackTrace$)) {
    $n_jl_StackTrace$ = new $c_jl_StackTrace$();
  }
  return $n_jl_StackTrace$;
}
/** @constructor */
function $c_jl_StackTrace$StringRE$() {
}
$p = $c_jl_StackTrace$StringRE$.prototype = new $h_O();
$p.constructor = $c_jl_StackTrace$StringRE$;
/** @constructor */
function $h_jl_StackTrace$StringRE$() {
}
$h_jl_StackTrace$StringRE$.prototype = $p;
$p.cb = (function(this$) {
  return new RegExp(this$);
});
$p.bB = (function(this$, mods) {
  return new RegExp(this$, mods);
});
var $d_jl_StackTrace$StringRE$ = new $TypeData().i($c_jl_StackTrace$StringRE$, "java.lang.StackTrace$StringRE$", ({
  eM: 1
}));
var $n_jl_StackTrace$StringRE$;
function $m_jl_StackTrace$StringRE$() {
  if ((!$n_jl_StackTrace$StringRE$)) {
    $n_jl_StackTrace$StringRE$ = new $c_jl_StackTrace$StringRE$();
  }
  return $n_jl_StackTrace$StringRE$;
}
function $p_jl_System$SystemProperties$__loadSystemProperties__O($thiz) {
  var result = ({});
  result["java.version"] = "1.8";
  result["java.vm.specification.version"] = "1.8";
  result["java.vm.specification.vendor"] = "Oracle Corporation";
  result["java.vm.specification.name"] = "Java Virtual Machine Specification";
  result["java.vm.name"] = "Scala.js";
  result["java.vm.version"] = "1.22.0";
  result["java.specification.version"] = "1.8";
  result["java.specification.vendor"] = "Oracle Corporation";
  result["java.specification.name"] = "Java Platform API Specification";
  result["file.separator"] = "/";
  result["path.separator"] = ":";
  result["line.separator"] = "\n";
  return result;
}
/** @constructor */
function $c_jl_System$SystemProperties$() {
  this.i6 = null;
  this.lk = null;
  $n_jl_System$SystemProperties$ = this;
  this.i6 = $p_jl_System$SystemProperties$__loadSystemProperties__O(this);
  this.lk = null;
}
$p = $c_jl_System$SystemProperties$.prototype = new $h_O();
$p.constructor = $c_jl_System$SystemProperties$;
/** @constructor */
function $h_jl_System$SystemProperties$() {
}
$h_jl_System$SystemProperties$.prototype = $p;
$p.j2 = (function(key, default$1) {
  if ((this.i6 !== null)) {
    var dict = this.i6;
    return ((!(!$m_jl_Utils$Cache$().i7.call(dict, key))) ? dict[key] : default$1);
  } else {
    return this.lk.j2(key, default$1);
  }
});
var $d_jl_System$SystemProperties$ = new $TypeData().i($c_jl_System$SystemProperties$, "java.lang.System$SystemProperties$", ({
  eP: 1
}));
var $n_jl_System$SystemProperties$;
function $m_jl_System$SystemProperties$() {
  if ((!$n_jl_System$SystemProperties$)) {
    $n_jl_System$SystemProperties$ = new $c_jl_System$SystemProperties$();
  }
  return $n_jl_System$SystemProperties$;
}
/** @constructor */
function $c_jl_Utils$Cache$() {
  this.i7 = null;
  $n_jl_Utils$Cache$ = this;
  this.i7 = Object.prototype.hasOwnProperty;
}
$p = $c_jl_Utils$Cache$.prototype = new $h_O();
$p.constructor = $c_jl_Utils$Cache$;
/** @constructor */
function $h_jl_Utils$Cache$() {
}
$h_jl_Utils$Cache$.prototype = $p;
var $d_jl_Utils$Cache$ = new $TypeData().i($c_jl_Utils$Cache$, "java.lang.Utils$Cache$", ({
  eS: 1
}));
var $n_jl_Utils$Cache$;
function $m_jl_Utils$Cache$() {
  if ((!$n_jl_Utils$Cache$)) {
    $n_jl_Utils$Cache$ = new $c_jl_Utils$Cache$();
  }
  return $n_jl_Utils$Cache$;
}
function $f_jl_Void__equals__O__Z($thiz, that) {
  return ($thiz === that);
}
function $f_jl_Void__hashCode__I($thiz) {
  return 0;
}
function $f_jl_Void__toString__T($thiz) {
  return "undefined";
}
function $isArrayOf_jl_Void(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bo)));
}
var $d_jl_Void = new $TypeData().i(0, "java.lang.Void", ({
  bo: 1
}), ((x) => (x === (void 0))));
function $p_jl_reflect_Array$__mismatch__O__E($thiz, array) {
  throw $ct_jl_IllegalArgumentException__T__(new $c_jl_IllegalArgumentException(), "argument type mismatch");
}
/** @constructor */
function $c_jl_reflect_Array$() {
}
$p = $c_jl_reflect_Array$.prototype = new $h_O();
$p.constructor = $c_jl_reflect_Array$;
/** @constructor */
function $h_jl_reflect_Array$() {
}
$h_jl_reflect_Array$.prototype = $p;
$p.bI = (function(array) {
  if ((array instanceof $ac_O)) {
    return array.a.length;
  } else if ((array instanceof $ac_Z)) {
    return array.a.length;
  } else if ((array instanceof $ac_C)) {
    return array.a.length;
  } else if ((array instanceof $ac_B)) {
    return array.a.length;
  } else if ((array instanceof $ac_S)) {
    return array.a.length;
  } else if ((array instanceof $ac_I)) {
    return array.a.length;
  } else if ((array instanceof $ac_J)) {
    return ((array.a.length >>> 1) | 0);
  } else if ((array instanceof $ac_F)) {
    return array.a.length;
  } else {
    if ((!(array instanceof $ac_D))) {
      $p_jl_reflect_Array$__mismatch__O__E(this, array);
    }
    return array.a.length;
  }
});
var $d_jl_reflect_Array$ = new $TypeData().i($c_jl_reflect_Array$, "java.lang.reflect.Array$", ({
  eU: 1
}));
var $n_jl_reflect_Array$;
function $m_jl_reflect_Array$() {
  if ((!$n_jl_reflect_Array$)) {
    $n_jl_reflect_Array$ = new $c_jl_reflect_Array$();
  }
  return $n_jl_reflect_Array$;
}
/** @constructor */
function $c_ju_Arrays$() {
}
$p = $c_ju_Arrays$.prototype = new $h_O();
$p.constructor = $c_ju_Arrays$;
/** @constructor */
function $h_ju_Arrays$() {
}
$h_ju_Arrays$.prototype = $p;
$p.oD = (function(a, key) {
  var startIndex = 0;
  var endIndex = a.a.length;
  while (true) {
    if ((startIndex === endIndex)) {
      return (~startIndex);
    } else {
      var mid = ((((startIndex + endIndex) | 0) >>> 1) | 0);
      var elem = a.a[mid];
      var cmp = ((key === elem) ? 0 : ((key < elem) ? (-1) : 1));
      if ((cmp < 0)) {
        endIndex = mid;
        continue;
      }
      if ((cmp !== 0)) {
        startIndex = ((1 + mid) | 0);
        continue;
      }
      return mid;
    }
  }
});
$p.mX = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = ((a.a.length >>> 1) | 0);
  if ((((b.a.length >>> 1) | 0) !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a;
    var $x_2 = (i$1 << 1);
    var a$1_$_lo = $x_1[$x_2];
    var a$1_$_hi = $x_1[(($x_2 + 1) | 0)];
    var i$2 = i;
    var $x_3 = b.a;
    var $x_4 = (i$2 << 1);
    var b$1_$_lo = $x_3[$x_4];
    var b$1_$_hi = $x_3[(($x_4 + 1) | 0)];
    if ((!(((a$1_$_lo ^ b$1_$_lo) | (a$1_$_hi ^ b$1_$_hi)) === 0))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.iQ = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = a.a.length;
  if ((b.a.length !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a[i$1];
    var i$2 = i;
    if ((!($x_1 === b.a[i$2]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.mY = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = a.a.length;
  if ((b.a.length !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a[i$1];
    var i$2 = i;
    if ((!($x_1 === b.a[i$2]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.mW = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = a.a.length;
  if ((b.a.length !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a[i$1];
    var i$2 = i;
    if ((!($x_1 === b.a[i$2]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.mV = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = a.a.length;
  if ((b.a.length !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a[i$1];
    var i$2 = i;
    if ((!($x_1 === b.a[i$2]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.mZ = (function(a, b) {
  if ((a === b)) {
    return true;
  }
  if (((a === null) || (b === null))) {
    return false;
  }
  var len = a.a.length;
  if ((b.a.length !== len)) {
    return false;
  }
  var i = 0;
  while ((i !== len)) {
    var i$1 = i;
    var $x_1 = a.a[i$1];
    var i$2 = i;
    if ((!($x_1 === b.a[i$2]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
$p.O = (function(original, newLength) {
  var b = original.a.length;
  var copyLength = ((newLength < b) ? newLength : b);
  var ret = $objectGetClass(original).X.Q().X.U(newLength);
  original.t(0, ret, 0, copyLength);
  return ret;
});
$p.a0 = (function(original, from, to) {
  if ((from > to)) {
    throw $ct_jl_IllegalArgumentException__T__(new $c_jl_IllegalArgumentException(), ((from + " > ") + to));
  }
  var len = original.a.length;
  var retLength = ((to - from) | 0);
  var b = ((len - from) | 0);
  var copyLength = ((retLength < b) ? retLength : b);
  var ret = $objectGetClass(original).X.Q().X.U(retLength);
  original.t(from, ret, 0, copyLength);
  return ret;
});
var $d_ju_Arrays$ = new $TypeData().i($c_ju_Arrays$, "java.util.Arrays$", ({
  eX: 1
}));
var $n_ju_Arrays$;
function $m_ju_Arrays$() {
  if ((!$n_ju_Arrays$)) {
    $n_ju_Arrays$ = new $c_ju_Arrays$();
  }
  return $n_ju_Arrays$;
}
function $is_ju_Formattable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.bp)));
}
function $isArrayOf_ju_Formattable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bp)));
}
/** @constructor */
function $c_ju_Formatter$() {
  this.lt = null;
  this.ls = null;
  $n_ju_Formatter$ = this;
  this.lt = new RegExp("(?:(\\d+)\\$)?([-#+ 0,\\(<]*)(\\d+)?(?:\\.(\\d+))?[%A-Za-z]", "g");
  this.ls = $constArrSVals_I(26, "3]3{0C{0H_1]8]_3{||||||0I]|||3y||||0A]||");
}
$p = $c_ju_Formatter$.prototype = new $h_O();
$p.constructor = $c_ju_Formatter$;
/** @constructor */
function $h_ju_Formatter$() {
}
$h_ju_Formatter$.prototype = $p;
$p.jb = (function(count) {
  if ((count <= 20)) {
    return "00000000000000000000".substring(0, count);
  } else {
    var result = "";
    var remaining = count;
    while ((remaining > 20)) {
      result = (result + "00000000000000000000");
      remaining = ((remaining - 20) | 0);
    }
    var $x_1 = result;
    var endIndex = remaining;
    return (("" + $x_1) + "00000000000000000000".substring(0, endIndex));
  }
});
$p.q2 = (function(x) {
  if ((x === 0.0)) {
    return new $c_ju_Formatter$Decimal(((1.0 / x) < 0.0), "0", 0);
  } else {
    var negative$2 = (x < 0.0);
    var d = (negative$2 ? (-x) : x);
    var s = ("" + d);
    var ePos = $f_T__indexOf__I__I(s, 101);
    if ((ePos < 0)) {
      var e = 0;
    } else {
      var $x_2 = parseInt;
      var beginIndex = ((1 + ePos) | 0);
      var $x_1 = $x_2(s.substring(beginIndex));
      var e = ($x_1 | 0);
    }
    var significandEnd = ((ePos < 0) ? s.length : ePos);
    var dotPos = $f_T__indexOf__I__I(s, 46);
    if ((dotPos < 0)) {
      return new $c_ju_Formatter$Decimal(negative$2, s.substring(0, significandEnd), ((-e) | 0));
    } else {
      var $x_3 = s.substring(0, dotPos);
      var beginIndex$1 = ((1 + dotPos) | 0);
      var digits = (("" + $x_3) + s.substring(beginIndex$1, significandEnd));
      var digitsLen = digits.length;
      var i = 0;
      while (((i < digitsLen) && (digits.charCodeAt(i) === 48))) {
        i = ((1 + i) | 0);
      }
      var beginIndex$2 = i;
      return new $c_ju_Formatter$Decimal(negative$2, digits.substring(beginIndex$2), ((((-e) | 0) + ((significandEnd - ((1 + dotPos) | 0)) | 0)) | 0));
    }
  }
});
$p.q1 = (function(x) {
  var unscaledValueWithSign = x.rt().p();
  if ((unscaledValueWithSign === "0")) {
    return new $c_ju_Formatter$Decimal(false, "0", 0);
  } else {
    var negative = (unscaledValueWithSign.charCodeAt(0) === 45);
    return new $c_ju_Formatter$Decimal(negative, (negative ? unscaledValueWithSign.substring(1) : unscaledValueWithSign), x.rr());
  }
});
var $d_ju_Formatter$ = new $TypeData().i($c_ju_Formatter$, "java.util.Formatter$", ({
  f2: 1
}));
var $n_ju_Formatter$;
function $m_ju_Formatter$() {
  if ((!$n_ju_Formatter$)) {
    $n_ju_Formatter$ = new $c_ju_Formatter$();
  }
  return $n_ju_Formatter$;
}
function $p_ju_Formatter$Decimal__roundAtPos__I__ju_Formatter$Decimal($thiz, roundingPos) {
  var digits = $thiz.cx;
  var digitsLen = digits.length;
  if ((roundingPos < 0)) {
    return new $c_ju_Formatter$Decimal($thiz.cw, "0", 0);
  } else if ((roundingPos >= digitsLen)) {
    return $thiz;
  } else if ((digits.charCodeAt(roundingPos) < 53)) {
    return ((roundingPos === 0) ? new $c_ju_Formatter$Decimal($thiz.cw, "0", 0) : new $c_ju_Formatter$Decimal($thiz.cw, digits.substring(0, roundingPos), (($thiz.ch - ((digitsLen - roundingPos) | 0)) | 0)));
  } else {
    var lastNonNinePos = ((roundingPos - 1) | 0);
    while (((lastNonNinePos >= 0) && (digits.charCodeAt(lastNonNinePos) === 57))) {
      lastNonNinePos = ((lastNonNinePos - 1) | 0);
    }
    if ((lastNonNinePos < 0)) {
      var newUnscaledValue = "1";
    } else {
      var endIndex = lastNonNinePos;
      var newUnscaledValue = (digits.substring(0, endIndex) + $cToS((65535 & ((1 + digits.charCodeAt(lastNonNinePos)) | 0))));
    }
    var pos = ((1 + lastNonNinePos) | 0);
    var newScale = (($thiz.ch - ((digitsLen - pos) | 0)) | 0);
    return new $c_ju_Formatter$Decimal($thiz.cw, newUnscaledValue, newScale);
  }
}
/** @constructor */
function $c_ju_Formatter$Decimal(negative, unscaledValue, scale) {
  this.cw = false;
  this.cx = null;
  this.ch = 0;
  this.cw = negative;
  this.cx = unscaledValue;
  this.ch = scale;
}
$p = $c_ju_Formatter$Decimal.prototype = new $h_O();
$p.constructor = $c_ju_Formatter$Decimal;
/** @constructor */
function $h_ju_Formatter$Decimal() {
}
$h_ju_Formatter$Decimal.prototype = $p;
$p.nd = (function() {
  return (this.cx === "0");
});
$p.nx = (function(precision) {
  $m_ju_Formatter$();
  if ((!(precision > 0))) {
    throw new $c_jl_AssertionError("Decimal.round() called with non-positive precision");
  }
  return $p_ju_Formatter$Decimal__roundAtPos__I__ju_Formatter$Decimal(this, precision);
});
$p.qT = (function(newScale) {
  var roundingPos = ((((this.cx.length + newScale) | 0) - this.ch) | 0);
  var rounded = $p_ju_Formatter$Decimal__roundAtPos__I__ju_Formatter$Decimal(this, roundingPos);
  $m_ju_Formatter$();
  if ((!(rounded.nd() || (rounded.ch <= newScale)))) {
    throw new $c_jl_AssertionError("roundAtPos returned a non-zero value with a scale too large");
  }
  return ((rounded.nd() || (rounded.ch === newScale)) ? rounded : new $c_ju_Formatter$Decimal(this.cw, (("" + rounded.cx) + $m_ju_Formatter$().jb(((newScale - rounded.ch) | 0))), newScale));
});
$p.p = (function() {
  return (((((("Decimal(" + this.cw) + ", ") + this.cx) + ", ") + this.ch) + ")");
});
var $d_ju_Formatter$Decimal = new $TypeData().i($c_ju_Formatter$Decimal, "java.util.Formatter$Decimal", ({
  f3: 1
}));
/** @constructor */
function $c_ju_Formatter$LocaleInfo() {
}
$p = $c_ju_Formatter$LocaleInfo.prototype = new $h_O();
$p.constructor = $c_ju_Formatter$LocaleInfo;
/** @constructor */
function $h_ju_Formatter$LocaleInfo() {
}
$h_ju_Formatter$LocaleInfo.prototype = $p;
/** @constructor */
function $c_Lnotebook_plugin_NotebookPlugin$() {
  this.i9 = null;
  $n_Lnotebook_plugin_NotebookPlugin$ = this;
  this.i9 = $m_s_None$();
}
$p = $c_Lnotebook_plugin_NotebookPlugin$.prototype = new $h_O();
$p.constructor = $c_Lnotebook_plugin_NotebookPlugin$;
/** @constructor */
function $h_Lnotebook_plugin_NotebookPlugin$() {
}
$h_Lnotebook_plugin_NotebookPlugin$.prototype = $p;
$p.pU = (function(plugin) {
  this.i9 = new $c_s_Some(plugin);
});
$p.qj = (function(container, payload, ctx) {
  var x1 = this.i9;
  if ((x1 instanceof $c_s_Some)) {
    return $f_Lnotebook_plugin_LaminarPlugin__mount__Lorg_scalajs_dom_Element__T__Lnotebook_plugin_PluginContext__Lnotebook_plugin_PluginHandle(x1.ez, container, payload, ctx);
  }
  if (($m_s_None$() === x1)) {
    throw new $c_sjs_js_JavaScriptException(Error("no NotebookPlugin installed: make your main object extend NotebookPlugin (and keep it the main class), or call NotebookPlugin.install")).Z;
  }
  throw new $c_s_MatchError(x1);
});
var $d_Lnotebook_plugin_NotebookPlugin$ = new $TypeData().i($c_Lnotebook_plugin_NotebookPlugin$, "notebook.plugin.NotebookPlugin$", ({
  fj: 1
}));
var $n_Lnotebook_plugin_NotebookPlugin$;
function $m_Lnotebook_plugin_NotebookPlugin$() {
  if ((!$n_Lnotebook_plugin_NotebookPlugin$)) {
    $n_Lnotebook_plugin_NotebookPlugin$ = new $c_Lnotebook_plugin_NotebookPlugin$();
  }
  return $n_Lnotebook_plugin_NotebookPlugin$;
}
/** @constructor */
function $c_Lnotebook_plugin_PluginHandle$() {
}
$p = $c_Lnotebook_plugin_PluginHandle$.prototype = new $h_O();
$p.constructor = $c_Lnotebook_plugin_PluginHandle$;
/** @constructor */
function $h_Lnotebook_plugin_PluginHandle$() {
}
$h_Lnotebook_plugin_PluginHandle$.prototype = $p;
$p.oz = (function(onUpdate, onUnmount) {
  return (() => {
    var onUpdate$2 = null;
    var onUnmount$2 = null;
    onUpdate$2 = onUpdate;
    onUnmount$2 = onUnmount;
    var this$1 = ({});
    Object.defineProperty(this$1, $m_sjsr_PrivateFieldsSymbolHolder$().eM, ({
      "value": ({
        "onUpdate$1": null,
        "onUnmount$1": null
      })
    }));
    this$1.update = (function(arg) {
      $s_Lnotebook_plugin_PluginHandle$$anon$1__update__Lnotebook_plugin_PluginHandle$$anon$1__T__V(this, arg);
    });
    this$1.unmount = (function() {
      $s_Lnotebook_plugin_PluginHandle$$anon$1__unmount__Lnotebook_plugin_PluginHandle$$anon$1__V(this);
    });
    this$1[$m_sjsr_PrivateFieldsSymbolHolder$().eM].onUpdate$1 = onUpdate$2;
    this$1[$m_sjsr_PrivateFieldsSymbolHolder$().eM].onUnmount$1 = onUnmount$2;
    return this$1;
  })();
});
var $d_Lnotebook_plugin_PluginHandle$ = new $TypeData().i($c_Lnotebook_plugin_PluginHandle$, "notebook.plugin.PluginHandle$", ({
  fk: 1
}));
var $n_Lnotebook_plugin_PluginHandle$;
function $m_Lnotebook_plugin_PluginHandle$() {
  if ((!$n_Lnotebook_plugin_PluginHandle$)) {
    $n_Lnotebook_plugin_PluginHandle$ = new $c_Lnotebook_plugin_PluginHandle$();
  }
  return $n_Lnotebook_plugin_PluginHandle$;
}
function $s_Lnotebook_plugin_PluginHandle$$anon$1__update__Lnotebook_plugin_PluginHandle$$anon$1__T__V(this$1, payload) {
  this$1[$m_sjsr_PrivateFieldsSymbolHolder$().eM].onUpdate$1.b(payload);
}
function $s_Lnotebook_plugin_PluginHandle$$anon$1__unmount__Lnotebook_plugin_PluginHandle$$anon$1__V(this$1) {
  this$1[$m_sjsr_PrivateFieldsSymbolHolder$().eM].onUnmount$1.L();
}
function $s_RTLong__remainderUnsigned__I__I__I__I__J(alo, ahi, blo, bhi) {
  return $m_RTLong$().qA(alo, ahi, blo, bhi);
}
function $s_RTLong__remainder__I__I__I__I__J(alo, ahi, blo, bhi) {
  return $m_RTLong$().qz(alo, ahi, blo, bhi);
}
function $s_RTLong__divideUnsigned__I__I__I__I__J(alo, ahi, blo, bhi) {
  return $m_RTLong$().p5(alo, ahi, blo, bhi);
}
function $s_RTLong__divide__I__I__I__I__J(alo, ahi, blo, bhi) {
  return $m_RTLong$().p4(alo, ahi, blo, bhi);
}
function $s_RTLong__fromDoubleBits__D__O__J(value, fpBitsDataView) {
  fpBitsDataView.setFloat64(0, value, true);
  var lo = (fpBitsDataView.getInt32(0, true) | 0);
  var hi = (fpBitsDataView.getInt32(4, true) | 0);
  return $bL(lo, hi);
}
function $s_RTLong__fromDouble__D__J(value) {
  return $m_RTLong$().n6(value);
}
function $s_RTLong__fromUnsignedInt__I__J(value) {
  return $bL(value, 0);
}
function $s_RTLong__fromInt__I__J(value) {
  var hi = (value >> 31);
  return $bL(value, hi);
}
function $s_RTLong__clz__I__I__I(lo, hi) {
  return ((hi !== 0) ? Math.clz32(hi) : ((32 + Math.clz32(lo)) | 0));
}
function $s_RTLong__toFloat__I__I__F(lo, hi) {
  return Math.fround(((4.294967296E9 * hi) + ((((((-2097152) & (hi ^ (hi >> 10))) === 0) || ((65535 & lo) === 0)) ? lo : (32768 | ((-32768) & lo))) >>> 0.0)));
}
function $s_RTLong__toDouble__I__I__D(lo, hi) {
  return ((4.294967296E9 * hi) + (lo >>> 0.0));
}
function $s_RTLong__toInt__I__I__I(lo, hi) {
  return lo;
}
function $s_RTLong__toString__I__I__T(lo, hi) {
  return $m_RTLong$().js(lo, hi);
}
function $s_RTLong__bitsToDouble__I__I__O__D(lo, hi, fpBitsDataView) {
  fpBitsDataView.setInt32(0, lo, true);
  fpBitsDataView.setInt32(4, hi, true);
  return (+fpBitsDataView.getFloat64(0, true));
}
function $s_RTLong__mul__I__I__I__I__J(alo, ahi, blo, bhi) {
  var a0 = (65535 & alo);
  var a1 = ((alo >>> 16) | 0);
  var b0 = (65535 & blo);
  var b1 = ((blo >>> 16) | 0);
  var a0b0 = Math.imul(a0, b0);
  var a1b0 = Math.imul(a1, b0);
  var a0b1 = Math.imul(a0, b1);
  var lo = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
  var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
  var hi = ((((((((Math.imul(alo, bhi) + Math.imul(ahi, blo)) | 0) + Math.imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0);
  return $bL(lo, hi);
}
function $s_RTLong__sub__I__I__I__I__J(alo, ahi, blo, bhi) {
  var lo = ((alo - blo) | 0);
  var hi = ((((ahi - bhi) | 0) - (((lo >>> 0) > (alo >>> 0)) | 0)) | 0);
  return $bL(lo, hi);
}
function $s_RTLong__add__I__I__I__I__J(alo, ahi, blo, bhi) {
  var lo = ((alo + blo) | 0);
  var hi = ((((ahi + bhi) | 0) + (((lo >>> 0) < (alo >>> 0)) | 0)) | 0);
  return $bL(lo, hi);
}
function $s_RTLong__sar__I__I__I__J(lo, hi, n) {
  var lo$1 = (((32 & n) === 0) ? (((lo >>> n) | 0) | ((hi << 1) << (~n))) : (hi >> n));
  var hi$1 = (((32 & n) === 0) ? (hi >> n) : (hi >> 31));
  return $bL(lo$1, hi$1);
}
function $s_RTLong__shr__I__I__I__J(lo, hi, n) {
  var lo$1 = (((32 & n) === 0) ? (((lo >>> n) | 0) | ((hi << 1) << (~n))) : ((hi >>> n) | 0));
  var hi$1 = (((32 & n) === 0) ? ((hi >>> n) | 0) : 0);
  return $bL(lo$1, hi$1);
}
function $s_RTLong__shl__I__I__I__J(lo, hi, n) {
  var lo$1 = (((32 & n) === 0) ? (lo << n) : 0);
  var hi$1 = (((32 & n) === 0) ? (((((lo >>> 1) | 0) >>> (~n)) | 0) | (hi << n)) : (lo << n));
  return $bL(lo$1, hi$1);
}
function $s_RTLong__xor__I__I__I__I__J(alo, ahi, blo, bhi) {
  var lo = (alo ^ blo);
  var hi = (ahi ^ bhi);
  return $bL(lo, hi);
}
function $s_RTLong__and__I__I__I__I__J(alo, ahi, blo, bhi) {
  var lo = (alo & blo);
  var hi = (ahi & bhi);
  return $bL(lo, hi);
}
function $s_RTLong__or__I__I__I__I__J(alo, ahi, blo, bhi) {
  var lo = (alo | blo);
  var hi = (ahi | bhi);
  return $bL(lo, hi);
}
function $s_RTLong__geu__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) >= (blo >>> 0)) : ((ahi >>> 0) > (bhi >>> 0)));
}
function $s_RTLong__gtu__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) > (blo >>> 0)) : ((ahi >>> 0) > (bhi >>> 0)));
}
function $s_RTLong__leu__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) <= (blo >>> 0)) : ((ahi >>> 0) < (bhi >>> 0)));
}
function $s_RTLong__ltu__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) < (blo >>> 0)) : ((ahi >>> 0) < (bhi >>> 0)));
}
function $s_RTLong__ge__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) >= (blo >>> 0)) : (ahi > bhi));
}
function $s_RTLong__gt__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) > (blo >>> 0)) : (ahi > bhi));
}
function $s_RTLong__le__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) <= (blo >>> 0)) : (ahi < bhi));
}
function $s_RTLong__lt__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo >>> 0) < (blo >>> 0)) : (ahi < bhi));
}
function $s_RTLong__notEquals__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return (((alo ^ blo) | (ahi ^ bhi)) !== 0);
}
function $s_RTLong__equals__I__I__I__I__Z(alo, ahi, blo, bhi) {
  return (((alo ^ blo) | (ahi ^ bhi)) === 0);
}
/** @constructor */
function $c_RTLong$() {
}
$p = $c_RTLong$.prototype = new $h_O();
$p.constructor = $c_RTLong$;
/** @constructor */
function $h_RTLong$() {
}
$h_RTLong$.prototype = $p;
$p.js = (function(lo, hi) {
  if ((hi === (lo >> 31))) {
    return ("" + lo);
  } else if ((((-2097152) & (hi ^ (hi >> 10))) === 0)) {
    return ("" + ((4.294967296E9 * hi) + (lo >>> 0.0)));
  } else {
    var sign = (hi >> 31);
    var xlo = (lo ^ sign);
    var rlo = ((xlo - sign) | 0);
    var rhi = (((hi ^ sign) + (((rlo >>> 0) < (xlo >>> 0)) | 0)) | 0);
    var aHat = ((4.294967296E9 * (rhi >>> 0.0)) + (rlo >>> 0.0));
    var qHat = (+Math.floor((1.0000000000000265E-9 * aHat)));
    var rHat = ((rlo - Math.imul(1000000000, (qHat | 0.0))) | 0);
    if ((rHat < 0)) {
      qHat = (qHat - 1.0);
      rHat = ((1000000000 + rHat) | 0);
    }
    var this$7 = rHat;
    var remStr = ("" + this$7);
    var $x_1 = qHat;
    var start = remStr.length;
    var s = ((("" + $x_1) + "000000000".substring(start)) + remStr);
    return ((hi < 0) ? ("-" + s) : s);
  }
});
$p.n6 = (function(value) {
  if ((value < (-9.223372036854776E18))) {
    return $bL(0, (-2147483648));
  } else if ((value >= 9.223372036854776E18)) {
    return $bL((-1), 2147483647);
  } else {
    var rawLo = (value | 0.0);
    var rawHi = ((2.3283064365386963E-10 * value) | 0.0);
    var hi = (((value < 0.0) && (rawLo !== 0)) ? ((rawHi - 1) | 0) : rawHi);
    return $bL(rawLo, hi);
  }
});
$p.p4 = (function(alo, ahi, blo, bhi) {
  var sign = (ahi >> 31);
  var xlo = (alo ^ sign);
  var rlo = ((xlo - sign) | 0);
  var rhi = (((ahi ^ sign) + (((rlo >>> 0) < (xlo >>> 0)) | 0)) | 0);
  var sign$1 = (bhi >> 31);
  var xlo$1 = (blo ^ sign$1);
  var rlo$1 = ((xlo$1 - sign$1) | 0);
  var rhi$1 = (((bhi ^ sign$1) + (((rlo$1 >>> 0) < (xlo$1 >>> 0)) | 0)) | 0);
  if (((rhi$1 | ((-2097152) & rlo$1)) === 0)) {
    var quotHi = (((rhi >>> 0) / ($checkIntDivisor(rlo$1) >>> 0)) | 0);
    var k = ((rhi - Math.imul(rlo$1, quotHi)) | 0);
    var quotLo = ((((4.294967296E9 * k) + (rlo >>> 0.0)) / rlo$1) | 0.0);
    var absR_$_lo = quotLo;
    var absR_$_hi = quotHi;
  } else {
    var aHat = ((4.294967296E9 * (rhi >>> 0.0)) + (rlo >>> 0.0));
    var bHat = ((4.294967296E9 * (rhi$1 >>> 0.0)) + (rlo$1 >>> 0.0));
    var x$1 = ((aHat / bHat) + 0.00390625);
    var lo = (x$1 | 0.0);
    var hi = ((2.3283064365386963E-10 * x$1) | 0.0);
    var a0 = (65535 & rlo$1);
    var a1 = ((rlo$1 >>> 16) | 0);
    var b0 = (65535 & lo);
    var b1 = ((lo >>> 16) | 0);
    var a0b0 = Math.imul(a0, b0);
    var a1b0 = Math.imul(a1, b0);
    var a0b1 = Math.imul(a0, b1);
    var lo$1 = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
    var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
    if ((((((rhi - ((((((((Math.imul(rlo$1, hi) + Math.imul(rhi$1, lo)) | 0) + Math.imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0)) | 0) - (((((rlo - lo$1) | 0) >>> 0) > (rlo >>> 0)) | 0)) | 0) < 0)) {
      var lo$3 = ((lo - 1) | 0);
      var hi$3 = ((((hi - 1) | 0) + ((lo$3 !== (-1)) | 0)) | 0);
      var absR_$_lo = lo$3;
      var absR_$_hi = hi$3;
    } else {
      var absR_$_lo = lo;
      var absR_$_hi = hi;
    }
  }
  if (((ahi ^ bhi) >= 0)) {
    return $bL(absR_$_lo, absR_$_hi);
  } else {
    var lo$4 = ((-absR_$_lo) | 0);
    var hi$4 = ((((-absR_$_hi) | 0) - ((lo$4 !== 0) | 0)) | 0);
    return $bL(lo$4, hi$4);
  }
});
$p.p5 = (function(alo, ahi, blo, bhi) {
  if (((bhi | ((-2097152) & blo)) === 0)) {
    var quotHi = (((ahi >>> 0) / ($checkIntDivisor(blo) >>> 0)) | 0);
    var k = ((ahi - Math.imul(blo, quotHi)) | 0);
    var quotLo = ((((4.294967296E9 * k) + (alo >>> 0.0)) / blo) | 0.0);
    return $bL(quotLo, quotHi);
  } else if ((bhi >= 0)) {
    var aHat = ((4.294967296E9 * (ahi >>> 0.0)) + (alo >>> 0.0));
    var bHat = ((4.294967296E9 * (bhi >>> 0.0)) + (blo >>> 0.0));
    var x$1 = ((aHat / bHat) + 0.00390625);
    var lo = (x$1 | 0.0);
    var hi = ((2.3283064365386963E-10 * x$1) | 0.0);
    var a0 = (65535 & blo);
    var a1 = ((blo >>> 16) | 0);
    var b0 = (65535 & lo);
    var b1 = ((lo >>> 16) | 0);
    var a0b0 = Math.imul(a0, b0);
    var a1b0 = Math.imul(a1, b0);
    var a0b1 = Math.imul(a0, b1);
    var lo$1 = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
    var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
    if ((((((ahi - ((((((((Math.imul(blo, hi) + Math.imul(bhi, lo)) | 0) + Math.imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0)) | 0) - (((((alo - lo$1) | 0) >>> 0) > (alo >>> 0)) | 0)) | 0) < 0)) {
      var lo$3 = ((lo - 1) | 0);
      var hi$3 = ((((hi - 1) | 0) + ((lo$3 !== (-1)) | 0)) | 0);
      return $bL(lo$3, hi$3);
    } else {
      return $bL(lo, hi);
    }
  } else if (((ahi === bhi) ? ((alo >>> 0) < (blo >>> 0)) : ((ahi >>> 0) < (bhi >>> 0)))) {
    return $bL(0, 0);
  } else {
    return $bL(1, 0);
  }
});
$p.qz = (function(alo, ahi, blo, bhi) {
  var sign = (ahi >> 31);
  var xlo = (alo ^ sign);
  var rlo = ((xlo - sign) | 0);
  var rhi = (((ahi ^ sign) + (((rlo >>> 0) < (xlo >>> 0)) | 0)) | 0);
  var sign$1 = (bhi >> 31);
  var xlo$1 = (blo ^ sign$1);
  var rlo$1 = ((xlo$1 - sign$1) | 0);
  var rhi$1 = (((bhi ^ sign$1) + (((rlo$1 >>> 0) < (xlo$1 >>> 0)) | 0)) | 0);
  if (((rhi$1 | ((-2097152) & rlo$1)) === 0)) {
    var k$2 = (((rhi >>> 0) % ($checkIntDivisor(rlo$1) >>> 0)) | 0);
    var quotLo$2 = ((((4.294967296E9 * k$2) + (rlo >>> 0.0)) / rlo$1) | 0.0);
    var remLo = ((rlo - Math.imul(rlo$1, quotLo$2)) | 0);
    var absR_$_lo = remLo;
    var absR_$_hi = 0;
  } else {
    var aHat = ((4.294967296E9 * (rhi >>> 0.0)) + (rlo >>> 0.0));
    var bHat = ((4.294967296E9 * (rhi$1 >>> 0.0)) + (rlo$1 >>> 0.0));
    var x$1 = ((aHat / bHat) + 0.00390625);
    var lo = (x$1 | 0.0);
    var hi = ((2.3283064365386963E-10 * x$1) | 0.0);
    var a0 = (65535 & rlo$1);
    var a1 = ((rlo$1 >>> 16) | 0);
    var b0 = (65535 & lo);
    var b1 = ((lo >>> 16) | 0);
    var a0b0 = Math.imul(a0, b0);
    var a1b0 = Math.imul(a1, b0);
    var a0b1 = Math.imul(a0, b1);
    var lo$1 = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
    var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
    var hi$1 = ((((((((Math.imul(rlo$1, hi) + Math.imul(rhi$1, lo)) | 0) + Math.imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0);
    var lo$2 = ((rlo - lo$1) | 0);
    var hi$2 = ((((rhi - hi$1) | 0) - (((lo$2 >>> 0) > (rlo >>> 0)) | 0)) | 0);
    if ((hi$2 < 0)) {
      var lo$3 = ((lo$2 + rlo$1) | 0);
      var hi$3 = ((((hi$2 + rhi$1) | 0) + (((lo$3 >>> 0) < (lo$2 >>> 0)) | 0)) | 0);
      var absR_$_lo = lo$3;
      var absR_$_hi = hi$3;
    } else {
      var absR_$_lo = lo$2;
      var absR_$_hi = hi$2;
    }
  }
  if ((ahi < 0)) {
    var lo$4 = ((-absR_$_lo) | 0);
    var hi$4 = ((((-absR_$_hi) | 0) - ((lo$4 !== 0) | 0)) | 0);
    return $bL(lo$4, hi$4);
  } else {
    return $bL(absR_$_lo, absR_$_hi);
  }
});
$p.qA = (function(alo, ahi, blo, bhi) {
  if (((bhi | ((-2097152) & blo)) === 0)) {
    var k$2 = (((ahi >>> 0) % ($checkIntDivisor(blo) >>> 0)) | 0);
    var quotLo$2 = ((((4.294967296E9 * k$2) + (alo >>> 0.0)) / blo) | 0.0);
    var remLo = ((alo - Math.imul(blo, quotLo$2)) | 0);
    return $bL(remLo, 0);
  } else if ((bhi >= 0)) {
    var aHat = ((4.294967296E9 * (ahi >>> 0.0)) + (alo >>> 0.0));
    var bHat = ((4.294967296E9 * (bhi >>> 0.0)) + (blo >>> 0.0));
    var x$1 = ((aHat / bHat) + 0.00390625);
    var lo = (x$1 | 0.0);
    var hi = ((2.3283064365386963E-10 * x$1) | 0.0);
    var a0 = (65535 & blo);
    var a1 = ((blo >>> 16) | 0);
    var b0 = (65535 & lo);
    var b1 = ((lo >>> 16) | 0);
    var a0b0 = Math.imul(a0, b0);
    var a1b0 = Math.imul(a1, b0);
    var a0b1 = Math.imul(a0, b1);
    var lo$1 = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
    var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
    var hi$1 = ((((((((Math.imul(blo, hi) + Math.imul(bhi, lo)) | 0) + Math.imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0);
    var lo$2 = ((alo - lo$1) | 0);
    var hi$2 = ((((ahi - hi$1) | 0) - (((lo$2 >>> 0) > (alo >>> 0)) | 0)) | 0);
    if ((hi$2 < 0)) {
      var lo$3 = ((lo$2 + blo) | 0);
      var hi$3 = ((((hi$2 + bhi) | 0) + (((lo$3 >>> 0) < (lo$2 >>> 0)) | 0)) | 0);
      return $bL(lo$3, hi$3);
    } else {
      return $bL(lo$2, hi$2);
    }
  } else if (((ahi === bhi) ? ((alo >>> 0) < (blo >>> 0)) : ((ahi >>> 0) < (bhi >>> 0)))) {
    return $bL(alo, ahi);
  } else {
    var lo$4 = ((alo - blo) | 0);
    var hi$4 = ((((ahi - bhi) | 0) - (((lo$4 >>> 0) > (alo >>> 0)) | 0)) | 0);
    return $bL(lo$4, hi$4);
  }
});
var $d_RTLong$ = new $TypeData().i($c_RTLong$, "org.scalajs.linker.runtime.RuntimeLong$", ({
  fl: 1
}));
var $n_RTLong$;
function $m_RTLong$() {
  if ((!$n_RTLong$)) {
    $n_RTLong$ = new $c_RTLong$();
  }
  return $n_RTLong$;
}
/** @constructor */
function $c_s_$less$colon$less$() {
  this.ex = null;
  $n_s_$less$colon$less$ = this;
  this.ex = new $c_s_$less$colon$less$$anon$1();
}
$p = $c_s_$less$colon$less$.prototype = new $h_O();
$p.constructor = $c_s_$less$colon$less$;
/** @constructor */
function $h_s_$less$colon$less$() {
}
$h_s_$less$colon$less$.prototype = $p;
var $d_s_$less$colon$less$ = new $TypeData().i($c_s_$less$colon$less$, "scala.$less$colon$less$", ({
  fo: 1
}));
var $n_s_$less$colon$less$;
function $m_s_$less$colon$less$() {
  if ((!$n_s_$less$colon$less$)) {
    $n_s_$less$colon$less$ = new $c_s_$less$colon$less$();
  }
  return $n_s_$less$colon$less$;
}
function $p_s_Array$__slowcopy__O__I__O__I__I__V($thiz, src, srcPos, dest, destPos, length) {
  var i = srcPos;
  var j = destPos;
  var srcUntil = ((srcPos + length) | 0);
  while ((i < srcUntil)) {
    $m_sr_ScalaRunTime$().gU(dest, j, $m_sr_ScalaRunTime$().e9(src, i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0);
  }
}
/** @constructor */
function $c_s_Array$() {
}
$p = $c_s_Array$.prototype = new $h_O();
$p.constructor = $c_s_Array$;
/** @constructor */
function $h_s_Array$() {
}
$h_s_Array$.prototype = $p;
$p.n2 = (function(it, evidence$1) {
  var n = it.u();
  if ((n > (-1))) {
    var elements = evidence$1.bl(n);
    var iterator = it.h();
    var i = 0;
    while ((i < n)) {
      $m_sr_ScalaRunTime$().gU(elements, i, iterator.i());
      i = ((1 + i) | 0);
    }
    return elements;
  } else {
    var capacity = 0;
    var size = 0;
    var jsElems = null;
    var elementClass = evidence$1.aI();
    capacity = 0;
    size = 0;
    var isCharArrayBuilder = (elementClass === $d_C.l());
    jsElems = [];
    var iterator$2 = it.h();
    while (iterator$2.j()) {
      var elem = iterator$2.i();
      var unboxedElem = (isCharArrayBuilder ? $uC(elem) : ((elem === null) ? $m_scm_ArrayBuilder$().ha(elementClass) : elem));
      jsElems.push(unboxedElem);
    }
    return $m_scm_ArrayBuilder$().h9(((elementClass === $d_V.l()) ? $d_jl_Void.l() : (((elementClass === $d_sr_Null$.l()) || (elementClass === $d_sr_Nothing$.l())) ? $d_O.l() : elementClass)), jsElems);
  }
});
$p.fW = (function(src, srcPos, dest, destPos, length) {
  var srcClass = $objectGetClass(src);
  if ((srcClass.X.Z && $objectGetClass(dest).X.R(srcClass.X))) {
    src.t(srcPos, dest, destPos, length);
  } else {
    $p_s_Array$__slowcopy__O__I__O__I__I__V(this, src, srcPos, dest, destPos, length);
  }
});
$p.n0 = (function(xs, ys) {
  if ((xs === ys)) {
    return true;
  }
  if ((xs.a.length !== ys.a.length)) {
    return false;
  }
  var len = xs.a.length;
  var i = 0;
  while ((i < len)) {
    if ((!$m_sr_BoxesRunTime$().k(xs.a[i], ys.a[i]))) {
      return false;
    }
    i = ((1 + i) | 0);
  }
  return true;
});
var $d_s_Array$ = new $TypeData().i($c_s_Array$, "scala.Array$", ({
  fq: 1
}));
var $n_s_Array$;
function $m_s_Array$() {
  if ((!$n_s_Array$)) {
    $n_s_Array$ = new $c_s_Array$();
  }
  return $n_s_Array$;
}
/** @constructor */
function $c_s_Array$EmptyArrays$() {
  this.ia = null;
  this.lE = null;
  $n_s_Array$EmptyArrays$ = this;
  this.ia = new $ac_I(0);
  this.lE = new $ac_O(0);
}
$p = $c_s_Array$EmptyArrays$.prototype = new $h_O();
$p.constructor = $c_s_Array$EmptyArrays$;
/** @constructor */
function $h_s_Array$EmptyArrays$() {
}
$h_s_Array$EmptyArrays$.prototype = $p;
var $d_s_Array$EmptyArrays$ = new $TypeData().i($c_s_Array$EmptyArrays$, "scala.Array$EmptyArrays$", ({
  fr: 1
}));
var $n_s_Array$EmptyArrays$;
function $m_s_Array$EmptyArrays$() {
  if ((!$n_s_Array$EmptyArrays$)) {
    $n_s_Array$EmptyArrays$ = new $c_s_Array$EmptyArrays$();
  }
  return $n_s_Array$EmptyArrays$;
}
var $d_F0 = new $TypeData().i(1, "scala.Function0", ({
  aJ: 1
}));
var $d_F1 = new $TypeData().i(1, "scala.Function1", ({
  h: 1
}));
/** @constructor */
function $c_s_LowPriorityImplicits2() {
}
$p = $c_s_LowPriorityImplicits2.prototype = new $h_O();
$p.constructor = $c_s_LowPriorityImplicits2;
/** @constructor */
function $h_s_LowPriorityImplicits2() {
}
$h_s_LowPriorityImplicits2.prototype = $p;
/** @constructor */
function $c_s_PartialFunction$() {
  this.lH = null;
  this.ey = null;
  $n_s_PartialFunction$ = this;
  this.lH = new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((_$2$2) => this.lH));
  this.ey = new $c_s_PartialFunction$$anon$1();
}
$p = $c_s_PartialFunction$.prototype = new $h_O();
$p.constructor = $c_s_PartialFunction$;
/** @constructor */
function $h_s_PartialFunction$() {
}
$h_s_PartialFunction$.prototype = $p;
var $d_s_PartialFunction$ = new $TypeData().i($c_s_PartialFunction$, "scala.PartialFunction$", ({
  fx: 1
}));
var $n_s_PartialFunction$;
function $m_s_PartialFunction$() {
  if ((!$n_s_PartialFunction$)) {
    $n_s_PartialFunction$ = new $c_s_PartialFunction$();
  }
  return $n_s_PartialFunction$;
}
/** @constructor */
function $c_sc_ArrayOps$() {
  this.lK = null;
  $n_sc_ArrayOps$ = this;
  this.lK = new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$1$2$2) => $m_sc_ArrayOps$().lK));
}
$p = $c_sc_ArrayOps$.prototype = new $h_O();
$p.constructor = $c_sc_ArrayOps$;
/** @constructor */
function $h_sc_ArrayOps$() {
}
$h_sc_ArrayOps$.prototype = $p;
$p.pl = (function(this$, f) {
  var len = $m_jl_reflect_Array$().bI(this$);
  var i = 0;
  if ((this$ instanceof $ac_O)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_I)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_D)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_J)) {
    while ((i < len)) {
      var $x_2 = this$.a;
      var $x_3 = (i << 1);
      var $x_1_$_lo = $x_2[$x_3];
      var $x_1_$_hi = $x_2[(($x_3 + 1) | 0)];
      f.b($bL($x_1_$_lo, $x_1_$_hi));
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_F)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_C)) {
    while ((i < len)) {
      f.b($bC(this$.a[i]));
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_B)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_S)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else if ((this$ instanceof $ac_Z)) {
    while ((i < len)) {
      f.b(this$.a[i]);
      i = ((1 + i) | 0);
    }
  } else {
    throw new $c_s_MatchError(this$);
  }
});
var $d_sc_ArrayOps$ = new $TypeData().i($c_sc_ArrayOps$, "scala.collection.ArrayOps$", ({
  fF: 1
}));
var $n_sc_ArrayOps$;
function $m_sc_ArrayOps$() {
  if ((!$n_sc_ArrayOps$)) {
    $n_sc_ArrayOps$ = new $c_sc_ArrayOps$();
  }
  return $n_sc_ArrayOps$;
}
/** @constructor */
function $c_sc_Hashing$() {
}
$p = $c_sc_Hashing$.prototype = new $h_O();
$p.constructor = $c_sc_Hashing$;
/** @constructor */
function $h_sc_Hashing$() {
}
$h_sc_Hashing$.prototype = $p;
$p.c8 = (function(hcode) {
  var h = ((hcode + (~(hcode << 9))) | 0);
  h = (h ^ ((h >>> 14) | 0));
  h = ((h + (h << 4)) | 0);
  return (h ^ ((h >>> 10) | 0));
});
var $d_sc_Hashing$ = new $TypeData().i($c_sc_Hashing$, "scala.collection.Hashing$", ({
  fJ: 1
}));
var $n_sc_Hashing$;
function $m_sc_Hashing$() {
  if ((!$n_sc_Hashing$)) {
    $n_sc_Hashing$ = new $c_sc_Hashing$();
  }
  return $n_sc_Hashing$;
}
function $f_sc_IterableOnceOps__foreach__F1__V($thiz, f) {
  var it = $thiz.h();
  while (it.j()) {
    f.b(it.i());
  }
}
function $f_sc_IterableOnceOps__forall__F1__Z($thiz, p) {
  var res = true;
  var it = $thiz.h();
  while ((res && it.j())) {
    res = (!(!p.b(it.i())));
  }
  return res;
}
function $f_sc_IterableOnceOps__isEmpty__Z($thiz) {
  var x30 = $thiz.u();
  if ((x30 === (-1))) {
    return (!$thiz.h().j());
  }
  if ((x30 === 0)) {
    return true;
  }
  return false;
}
function $f_sc_IterableOnceOps__copyToArray__O__I__I__I($thiz, dest, start, n) {
  var it = $thiz.h();
  var i = start;
  matchResult18: {
    var srclen;
    var x31 = $thiz.u();
    if ((x31 === (-1))) {
      var srclen = $m_jl_reflect_Array$().bI(dest);
      break matchResult18;
    }
    var srclen = x31;
  }
  var destLen = $m_jl_reflect_Array$().bI(dest);
  var limit = ((n < srclen) ? n : srclen);
  var capacity = ((start < 0) ? destLen : ((destLen - start) | 0));
  var total = ((capacity < limit) ? capacity : limit);
  var end = ((start + ((total < 0) ? 0 : total)) | 0);
  while (((i < end) && it.j())) {
    $m_sr_ScalaRunTime$().gU(dest, i, it.i());
    i = ((1 + i) | 0);
  }
  return ((i - start) | 0);
}
function $f_sc_IterableOnceOps__mkString__T__T__T__T($thiz, start, sep, end) {
  return (($thiz.u() === 0) ? (("" + start) + end) : $thiz.dz($ct_scm_StringBuilder__(new $c_scm_StringBuilder()), start, sep, end).aS.n);
}
function $f_sc_IterableOnceOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder($thiz, b, start, sep, end) {
  var jsb = b.aS;
  if ((start.length !== 0)) {
    jsb.n = (("" + jsb.n) + start);
  }
  var it = $thiz.h();
  if (it.j()) {
    var obj = it.i();
    jsb.n = (("" + jsb.n) + obj);
    while (it.j()) {
      if ((sep.length !== 0)) {
        jsb.n = (("" + jsb.n) + sep);
      }
      var obj$1 = it.i();
      jsb.n = (("" + jsb.n) + obj$1);
    }
  }
  if ((end.length !== 0)) {
    jsb.n = (("" + jsb.n) + end);
  }
  return b;
}
function $f_sc_IterableOnceOps__toArray__s_reflect_ClassTag__O($thiz, evidence$1) {
  if (($thiz.u() >= 0)) {
    var length = $thiz.u();
    var destination = evidence$1.bl(length);
    $thiz.by(destination, 0, 2147483647);
    return destination;
  } else {
    var capacity = 0;
    var size = 0;
    var jsElems = null;
    var elementClass = evidence$1.aI();
    capacity = 0;
    size = 0;
    var isCharArrayBuilder = (elementClass === $d_C.l());
    jsElems = [];
    var it = $thiz.h();
    while (it.j()) {
      var elem = it.i();
      var unboxedElem = (isCharArrayBuilder ? $uC(elem) : ((elem === null) ? $m_scm_ArrayBuilder$().ha(elementClass) : elem));
      jsElems.push(unboxedElem);
    }
    return $m_scm_ArrayBuilder$().h9(((elementClass === $d_V.l()) ? $d_jl_Void.l() : (((elementClass === $d_sr_Null$.l()) || (elementClass === $d_sr_Nothing$.l())) ? $d_O.l() : elementClass)), jsElems);
  }
}
/** @constructor */
function $c_sc_Iterator$ConcatIteratorCell(head, tail) {
  this.lQ = null;
  this.fs = null;
  this.lQ = head;
  this.fs = tail;
}
$p = $c_sc_Iterator$ConcatIteratorCell.prototype = new $h_O();
$p.constructor = $c_sc_Iterator$ConcatIteratorCell;
/** @constructor */
function $h_sc_Iterator$ConcatIteratorCell() {
}
$h_sc_Iterator$ConcatIteratorCell.prototype = $p;
$p.pK = (function() {
  return this.lQ.L().h();
});
var $d_sc_Iterator$ConcatIteratorCell = new $TypeData().i($c_sc_Iterator$ConcatIteratorCell, "scala.collection.Iterator$ConcatIteratorCell", ({
  fS: 1
}));
/** @constructor */
function $c_sc_StringOps$() {
  this.lT = null;
  $n_sc_StringOps$ = this;
  this.lT = new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((_$1$2) => this.lT));
}
$p = $c_sc_StringOps$.prototype = new $h_O();
$p.constructor = $c_sc_StringOps$;
/** @constructor */
function $h_sc_StringOps$() {
}
$h_sc_StringOps$.prototype = $p;
$p.oR = (function(this$, elem) {
  return ($f_T__indexOf__I__I(this$, elem) >= 0);
});
$p.qL = (function(this$, arg) {
  return (false ? arg.rs() : arg);
});
$p.po = (function(this$, args) {
  return $m_jl_String$().pm(this$, $m_sr_Arrays$().qN(args.K(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((arg$2) => this.qL(this$, arg$2)))), $d_O.l()));
});
var $d_sc_StringOps$ = new $TypeData().i($c_sc_StringOps$, "scala.collection.StringOps$", ({
  fZ: 1
}));
var $n_sc_StringOps$;
function $m_sc_StringOps$() {
  if ((!$n_sc_StringOps$)) {
    $n_sc_StringOps$ = new $c_sc_StringOps$();
  }
  return $n_sc_StringOps$;
}
function $p_sc_StringParsers$__step$1__I__T__I__I__Z__s_Option($thiz, len$2, from$2, i, agg, isPositive) {
  var agg$tailLocal2 = agg;
  var i$tailLocal2 = i;
  while (true) {
    if ((i$tailLocal2 === len$2)) {
      return ((!isPositive) ? new $c_s_Some(agg$tailLocal2) : ((agg$tailLocal2 === (-2147483648)) ? $m_s_None$() : new $c_s_Some(((-agg$tailLocal2) | 0))));
    } else if ((agg$tailLocal2 < (-214748364))) {
      return $m_s_None$();
    } else {
      var digit = $m_jl_Character$().iO(from$2.charCodeAt(i$tailLocal2), 10);
      if (((digit === (-1)) || ((((-214748364) ^ agg$tailLocal2) | (9 ^ digit)) === 0))) {
        return $m_s_None$();
      } else {
        var i$tailLocal2$tmp1 = ((1 + i$tailLocal2) | 0);
        var agg$tailLocal2$tmp1 = ((Math.imul(10, agg$tailLocal2) - digit) | 0);
        i$tailLocal2 = i$tailLocal2$tmp1;
        agg$tailLocal2 = agg$tailLocal2$tmp1;
      }
    }
  }
}
/** @constructor */
function $c_sc_StringParsers$() {
}
$p = $c_sc_StringParsers$.prototype = new $h_O();
$p.constructor = $c_sc_StringParsers$;
/** @constructor */
function $h_sc_StringParsers$() {
}
$h_sc_StringParsers$.prototype = $p;
$p.qv = (function(from) {
  var len = from.length;
  if ((len === 0)) {
    return $m_s_None$();
  } else {
    var first = from.charCodeAt(0);
    var v = $m_jl_Character$().iO(first, 10);
    return ((len === 1) ? ((v > (-1)) ? new $c_s_Some(v) : $m_s_None$()) : ((v > (-1)) ? $p_sc_StringParsers$__step$1__I__T__I__I__Z__s_Option(this, len, from, 1, ((-v) | 0), true) : ((first === 43) ? $p_sc_StringParsers$__step$1__I__T__I__I__Z__s_Option(this, len, from, 1, 0, true) : ((first === 45) ? $p_sc_StringParsers$__step$1__I__T__I__I__Z__s_Option(this, len, from, 1, 0, false) : $m_s_None$()))));
  }
});
var $d_sc_StringParsers$ = new $TypeData().i($c_sc_StringParsers$, "scala.collection.StringParsers$", ({
  g0: 1
}));
var $n_sc_StringParsers$;
function $m_sc_StringParsers$() {
  if ((!$n_sc_StringParsers$)) {
    $n_sc_StringParsers$ = new $c_sc_StringParsers$();
  }
  return $n_sc_StringParsers$;
}
/** @constructor */
function $c_scg_CommonErrors$() {
}
$p = $c_scg_CommonErrors$.prototype = new $h_O();
$p.constructor = $c_scg_CommonErrors$;
/** @constructor */
function $h_scg_CommonErrors$() {
}
$h_scg_CommonErrors$.prototype = $p;
$p.j7 = (function(index, max) {
  return $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), (((index + " is out of bounds (min 0, max ") + max) + ")"));
});
var $d_scg_CommonErrors$ = new $TypeData().i($c_scg_CommonErrors$, "scala.collection.generic.CommonErrors$", ({
  g4: 1
}));
var $n_scg_CommonErrors$;
function $m_scg_CommonErrors$() {
  if ((!$n_scg_CommonErrors$)) {
    $n_scg_CommonErrors$ = new $c_scg_CommonErrors$();
  }
  return $n_scg_CommonErrors$;
}
/** @constructor */
function $c_sci_IndexedSeqDefaults$() {
  this.lY = 0;
  $n_sci_IndexedSeqDefaults$ = this;
  try {
    $m_sc_StringOps$();
    var $x_1 = $m_jl_Integer$().ne($m_jl_System$SystemProperties$().j2("scala.collection.immutable.IndexedSeq.defaultApplyPreferredMaxLength", "64"), 10, 214748364);
  } catch (e) {
    if (false) {
      var $x_1 = 64;
    } else {
      var $x_1;
      throw e;
    }
  }
  this.lY = $x_1;
}
$p = $c_sci_IndexedSeqDefaults$.prototype = new $h_O();
$p.constructor = $c_sci_IndexedSeqDefaults$;
/** @constructor */
function $h_sci_IndexedSeqDefaults$() {
}
$h_sci_IndexedSeqDefaults$.prototype = $p;
var $d_sci_IndexedSeqDefaults$ = new $TypeData().i($c_sci_IndexedSeqDefaults$, "scala.collection.immutable.IndexedSeqDefaults$", ({
  gd: 1
}));
var $n_sci_IndexedSeqDefaults$;
function $m_sci_IndexedSeqDefaults$() {
  if ((!$n_sci_IndexedSeqDefaults$)) {
    $n_sci_IndexedSeqDefaults$ = new $c_sci_IndexedSeqDefaults$();
  }
  return $n_sci_IndexedSeqDefaults$;
}
/** @constructor */
function $c_sci_LazyList$EmptyMarker$() {
}
$p = $c_sci_LazyList$EmptyMarker$.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$EmptyMarker$;
/** @constructor */
function $h_sci_LazyList$EmptyMarker$() {
}
$h_sci_LazyList$EmptyMarker$.prototype = $p;
var $d_sci_LazyList$EmptyMarker$ = new $TypeData().i($c_sci_LazyList$EmptyMarker$, "scala.collection.immutable.LazyList$EmptyMarker$", ({
  gg: 1
}));
var $n_sci_LazyList$EmptyMarker$;
function $m_sci_LazyList$EmptyMarker$() {
  if ((!$n_sci_LazyList$EmptyMarker$)) {
    $n_sci_LazyList$EmptyMarker$ = new $c_sci_LazyList$EmptyMarker$();
  }
  return $n_sci_LazyList$EmptyMarker$;
}
/** @constructor */
function $c_sci_LazyList$LazyBuilder$DeferredState() {
  this.ii = null;
}
$p = $c_sci_LazyList$LazyBuilder$DeferredState.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$LazyBuilder$DeferredState;
/** @constructor */
function $h_sci_LazyList$LazyBuilder$DeferredState() {
}
$h_sci_LazyList$LazyBuilder$DeferredState.prototype = $p;
$p.iR = (function() {
  var state = this.ii;
  if ((state === null)) {
    throw $ct_jl_IllegalStateException__T__(new $c_jl_IllegalStateException(), "uninitialized");
  }
  return state.L();
});
$p.j8 = (function(state) {
  if ((this.ii !== null)) {
    throw $ct_jl_IllegalStateException__T__(new $c_jl_IllegalStateException(), "already initialized");
  }
  this.ii = state;
});
var $d_sci_LazyList$LazyBuilder$DeferredState = new $TypeData().i($c_sci_LazyList$LazyBuilder$DeferredState, "scala.collection.immutable.LazyList$LazyBuilder$DeferredState", ({
  gi: 1
}));
/** @constructor */
function $c_sci_LazyList$MidEvaluation$() {
}
$p = $c_sci_LazyList$MidEvaluation$.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$MidEvaluation$;
/** @constructor */
function $h_sci_LazyList$MidEvaluation$() {
}
$h_sci_LazyList$MidEvaluation$.prototype = $p;
var $d_sci_LazyList$MidEvaluation$ = new $TypeData().i($c_sci_LazyList$MidEvaluation$, "scala.collection.immutable.LazyList$MidEvaluation$", ({
  gk: 1
}));
var $n_sci_LazyList$MidEvaluation$;
function $m_sci_LazyList$MidEvaluation$() {
  if ((!$n_sci_LazyList$MidEvaluation$)) {
    $n_sci_LazyList$MidEvaluation$ = new $c_sci_LazyList$MidEvaluation$();
  }
  return $n_sci_LazyList$MidEvaluation$;
}
/** @constructor */
function $c_sci_MapNode$() {
  this.m1 = null;
  $n_sci_MapNode$ = this;
  $m_s_reflect_ManifestFactory$IntManifest$();
  this.m1 = new $c_sci_BitmapIndexedMapNode(0, 0, new $ac_O(0), new $ac_I(0), 0, 0);
}
$p = $c_sci_MapNode$.prototype = new $h_O();
$p.constructor = $c_sci_MapNode$;
/** @constructor */
function $h_sci_MapNode$() {
}
$h_sci_MapNode$.prototype = $p;
var $d_sci_MapNode$ = new $TypeData().i($c_sci_MapNode$, "scala.collection.immutable.MapNode$", ({
  gz: 1
}));
var $n_sci_MapNode$;
function $m_sci_MapNode$() {
  if ((!$n_sci_MapNode$)) {
    $n_sci_MapNode$ = new $c_sci_MapNode$();
  }
  return $n_sci_MapNode$;
}
function $p_sci_Node__arrayIndexOutOfBounds__O__I__jl_ArrayIndexOutOfBoundsException($thiz, as, ix) {
  return $ct_jl_ArrayIndexOutOfBoundsException__T__(new $c_jl_ArrayIndexOutOfBoundsException(), ((ix + " is out of bounds (min 0, max ") + (($m_jl_reflect_Array$().bI(as) - 1) | 0)));
}
/** @constructor */
function $c_sci_Node() {
}
$p = $c_sci_Node.prototype = new $h_O();
$p.constructor = $c_sci_Node;
/** @constructor */
function $h_sci_Node() {
}
$h_sci_Node.prototype = $p;
$p.nq = (function(as, ix) {
  if ((ix < 0)) {
    throw $p_sci_Node__arrayIndexOutOfBounds__O__I__jl_ArrayIndexOutOfBoundsException(this, as, ix);
  }
  if ((ix > ((as.a.length - 1) | 0))) {
    throw $p_sci_Node__arrayIndexOutOfBounds__O__I__jl_ArrayIndexOutOfBoundsException(this, as, ix);
  }
  var result = new $ac_I(((as.a.length - 1) | 0));
  as.t(0, result, 0, ix);
  var srcPos = ((1 + ix) | 0);
  var length = ((((as.a.length - ix) | 0) - 1) | 0);
  as.t(srcPos, result, ix, length);
  return result;
});
$p.pT = (function(as, ix, elem) {
  if ((ix < 0)) {
    throw $p_sci_Node__arrayIndexOutOfBounds__O__I__jl_ArrayIndexOutOfBoundsException(this, as, ix);
  }
  if ((ix > as.a.length)) {
    throw $p_sci_Node__arrayIndexOutOfBounds__O__I__jl_ArrayIndexOutOfBoundsException(this, as, ix);
  }
  var result = new $ac_I(((1 + as.a.length) | 0));
  as.t(0, result, 0, ix);
  result.a[ix] = elem;
  var destPos = ((1 + ix) | 0);
  var length = ((as.a.length - ix) | 0);
  as.t(ix, result, destPos, length);
  return result;
});
var $d_sci_Node = new $TypeData().i(0, "scala.collection.immutable.Node", ({
  aU: 1
}));
/** @constructor */
function $c_sci_Node$() {
  this.fC = 0;
  $n_sci_Node$ = this;
  this.fC = $doubleToInt((+Math.ceil(6.4)));
}
$p = $c_sci_Node$.prototype = new $h_O();
$p.constructor = $c_sci_Node$;
/** @constructor */
function $h_sci_Node$() {
}
$h_sci_Node$.prototype = $p;
$p.ef = (function(hash, shift) {
  return (31 & ((hash >>> shift) | 0));
});
$p.dD = (function(mask) {
  return (1 << mask);
});
$p.pL = (function(bitmap, bitpos) {
  return $m_jl_Integer$().dC((bitmap & ((bitpos - 1) | 0)));
});
$p.cq = (function(bitmap, mask, bitpos) {
  return ((bitmap === (-1)) ? mask : this.pL(bitmap, bitpos));
});
var $d_sci_Node$ = new $TypeData().i($c_sci_Node$, "scala.collection.immutable.Node$", ({
  gC: 1
}));
var $n_sci_Node$;
function $m_sci_Node$() {
  if ((!$n_sci_Node$)) {
    $n_sci_Node$ = new $c_sci_Node$();
  }
  return $n_sci_Node$;
}
/** @constructor */
function $c_sci_VectorStatics$() {
  this.im = null;
  this.bk = null;
  this.cn = null;
  this.eI = null;
  this.io = null;
  this.m5 = null;
  $n_sci_VectorStatics$ = this;
  this.im = new $ac_O(0);
  this.bk = new ($d_O.r().r().C)(0);
  this.cn = new ($d_O.r().r().r().C)(0);
  this.eI = new ($d_O.r().r().r().r().C)(0);
  this.io = new ($d_O.r().r().r().r().r().C)(0);
  this.m5 = new ($d_O.r().r().r().r().r().r().C)(0);
}
$p = $c_sci_VectorStatics$.prototype = new $h_O();
$p.constructor = $c_sci_VectorStatics$;
/** @constructor */
function $h_sci_VectorStatics$() {
}
$h_sci_VectorStatics$.prototype = $p;
$p.eP = (function(a, elem) {
  var alen = a.a.length;
  var ac = new $ac_O(((1 + alen) | 0));
  a.t(0, ac, 0, alen);
  ac.a[alen] = elem;
  return ac;
});
$p.z = (function(a, elem) {
  var ac = $m_ju_Arrays$().O(a, ((1 + a.a.length) | 0));
  ac.a[((ac.a.length - 1) | 0)] = elem;
  return ac;
});
$p.cp = (function(elem, a) {
  var ac = $objectGetClass(a).X.Q().X.U(((1 + a.a.length) | 0));
  var length$1 = a.a.length;
  a.t(0, ac, 1, length$1);
  ac.a[0] = elem;
  return ac;
});
$p.iT = (function(level, a, f) {
  var i = 0;
  var len = a.a.length;
  if ((level === 0)) {
    while ((i < len)) {
      f.b(a.a[i]);
      i = ((1 + i) | 0);
    }
  } else {
    var l = ((level - 1) | 0);
    while ((i < len)) {
      this.iT(l, a.a[i], f);
      i = ((1 + i) | 0);
    }
  }
});
$p.bX = (function(a, f) {
  var i = 0;
  while ((i < a.a.length)) {
    var v1 = a.a[i];
    var v2 = f.b(v1);
    if ((!Object.is(v1, v2))) {
      return this.qb(a, f, i, v2);
    }
    i = ((1 + i) | 0);
  }
  return a;
});
$p.qb = (function(a, f, at, v2) {
  var ac = new $ac_O(a.a.length);
  if ((at > 0)) {
    a.t(0, ac, 0, at);
  }
  ac.a[at] = v2;
  var i = ((1 + at) | 0);
  while ((i < a.a.length)) {
    ac.a[i] = f.b(a.a[i]);
    i = ((1 + i) | 0);
  }
  return ac;
});
$p.W = (function(n, a, f) {
  if ((n === 1)) {
    return this.bX(a, f);
  } else {
    var i = 0;
    while ((i < a.a.length)) {
      var v1 = a.a[i];
      var v2 = this.W(((n - 1) | 0), v1, f);
      if ((v1 !== v2)) {
        return this.qc(n, a, f, i, v2);
      }
      i = ((1 + i) | 0);
    }
    return a;
  }
});
$p.qc = (function(n, a, f, at, v2) {
  var ac = $objectGetClass(a).X.Q().X.U(a.a.length);
  if ((at > 0)) {
    a.t(0, ac, 0, at);
  }
  ac.a[at] = v2;
  var i = ((1 + at) | 0);
  while ((i < a.a.length)) {
    ac.a[i] = this.W(((n - 1) | 0), a.a[i], f);
    i = ((1 + i) | 0);
  }
  return ac;
});
var $d_sci_VectorStatics$ = new $TypeData().i($c_sci_VectorStatics$, "scala.collection.immutable.VectorStatics$", ({
  gT: 1
}));
var $n_sci_VectorStatics$;
function $m_sci_VectorStatics$() {
  if ((!$n_sci_VectorStatics$)) {
    $n_sci_VectorStatics$ = new $c_sci_VectorStatics$();
  }
  return $n_sci_VectorStatics$;
}
/** @constructor */
function $c_scm_ArrayBuilder$() {
}
$p = $c_scm_ArrayBuilder$.prototype = new $h_O();
$p.constructor = $c_scm_ArrayBuilder$;
/** @constructor */
function $h_scm_ArrayBuilder$() {
}
$h_scm_ArrayBuilder$.prototype = $p;
$p.ha = (function(runtimeClass) {
  return ((runtimeClass === $d_B.l()) ? 0 : ((runtimeClass === $d_S.l()) ? 0 : ((runtimeClass === $d_C.l()) ? 0 : ((runtimeClass === $d_I.l()) ? 0 : ((runtimeClass === $d_J.l()) ? $bL(0, 0) : ((runtimeClass === $d_F.l()) ? 0.0 : ((runtimeClass === $d_D.l()) ? 0.0 : ((runtimeClass === $d_Z.l()) ? false : ((runtimeClass === $d_V.l()) ? (void 0) : null)))))))));
});
$p.h9 = (function(runtimeClass, a) {
  var len = (a.length | 0);
  if ((runtimeClass === $d_C.l())) {
    var result = new $ac_C(len);
    var i = 0;
    while ((i !== len)) {
      result.a[i] = (65535 & (a[i] | 0));
      i = ((1 + i) | 0);
    }
    return result;
  } else {
    var result$2 = runtimeClass.X.U(len);
    var i$2 = 0;
    while ((i$2 !== len)) {
      $m_sr_ScalaRunTime$().gU(result$2, i$2, a[i$2]);
      i$2 = ((1 + i$2) | 0);
    }
    return result$2;
  }
});
var $d_scm_ArrayBuilder$ = new $TypeData().i($c_scm_ArrayBuilder$, "scala.collection.mutable.ArrayBuilder$", ({
  h0: 1
}));
var $n_scm_ArrayBuilder$;
function $m_scm_ArrayBuilder$() {
  if ((!$n_scm_ArrayBuilder$)) {
    $n_scm_ArrayBuilder$ = new $c_scm_ArrayBuilder$();
  }
  return $n_scm_ArrayBuilder$;
}
/** @constructor */
function $c_scm_HashSet$Node(_key, _hash, _next) {
  this.eL = null;
  this.cM = 0;
  this.aR = null;
  this.eL = _key;
  this.cM = _hash;
  this.aR = _next;
}
$p = $c_scm_HashSet$Node.prototype = new $h_O();
$p.constructor = $c_scm_HashSet$Node;
/** @constructor */
function $h_scm_HashSet$Node() {
}
$h_scm_HashSet$Node.prototype = $p;
$p.ph = (function(k, h) {
  var \u03b4this$tailLocal1 = this;
  while (true) {
    if (((h === \u03b4this$tailLocal1.cM) && $m_sr_BoxesRunTime$().k(k, \u03b4this$tailLocal1.eL))) {
      return \u03b4this$tailLocal1;
    } else if (((\u03b4this$tailLocal1.aR === null) || (\u03b4this$tailLocal1.cM > h))) {
      return null;
    } else {
      \u03b4this$tailLocal1 = \u03b4this$tailLocal1.aR;
    }
  }
});
$p.p = (function() {
  return ((((("Node(" + this.eL) + ", ") + this.cM) + ") -> ") + this.aR);
});
var $d_scm_HashSet$Node = new $TypeData().i($c_scm_HashSet$Node, "scala.collection.mutable.HashSet$Node", ({
  he: 1
}));
/** @constructor */
function $c_scm_MutationTracker$() {
}
$p = $c_scm_MutationTracker$.prototype = new $h_O();
$p.constructor = $c_scm_MutationTracker$;
/** @constructor */
function $h_scm_MutationTracker$() {
}
$h_scm_MutationTracker$.prototype = $p;
$p.mK = (function(expectedCount, actualCount, message) {
  if ((actualCount !== expectedCount)) {
    throw new $c_ju_ConcurrentModificationException(message);
  }
});
var $d_scm_MutationTracker$ = new $TypeData().i($c_scm_MutationTracker$, "scala.collection.mutable.MutationTracker$", ({
  hk: 1
}));
var $n_scm_MutationTracker$;
function $m_scm_MutationTracker$() {
  if ((!$n_scm_MutationTracker$)) {
    $n_scm_MutationTracker$ = new $c_scm_MutationTracker$();
  }
  return $n_scm_MutationTracker$;
}
/** @constructor */
function $c_s_reflect_ClassTag$() {
  this.nZ = null;
  this.o8 = null;
  this.o0 = null;
  this.o3 = null;
  this.o4 = null;
  this.o2 = null;
  this.o1 = null;
  this.nY = null;
  this.o9 = null;
  this.nX = null;
  this.o7 = null;
  this.o5 = null;
  this.o6 = null;
  $n_s_reflect_ClassTag$ = this;
  this.nZ = $m_s_reflect_ManifestFactory$ByteManifest$();
  this.o8 = $m_s_reflect_ManifestFactory$ShortManifest$();
  this.o0 = $m_s_reflect_ManifestFactory$CharManifest$();
  this.o3 = $m_s_reflect_ManifestFactory$IntManifest$();
  this.o4 = $m_s_reflect_ManifestFactory$LongManifest$();
  this.o2 = $m_s_reflect_ManifestFactory$FloatManifest$();
  this.o1 = $m_s_reflect_ManifestFactory$DoubleManifest$();
  this.nY = $m_s_reflect_ManifestFactory$BooleanManifest$();
  this.o9 = $m_s_reflect_ManifestFactory$UnitManifest$();
  this.nX = $m_s_reflect_ManifestFactory$AnyManifest$();
  this.o7 = $m_s_reflect_ManifestFactory$ObjectManifest$();
  this.o5 = $m_s_reflect_ManifestFactory$NothingManifest$();
  this.o6 = $m_s_reflect_ManifestFactory$NullManifest$();
}
$p = $c_s_reflect_ClassTag$.prototype = new $h_O();
$p.constructor = $c_s_reflect_ClassTag$;
/** @constructor */
function $h_s_reflect_ClassTag$() {
}
$h_s_reflect_ClassTag$.prototype = $p;
$p.mF = (function(runtimeClass1) {
  return ((runtimeClass1 === $d_B.l()) ? $m_s_reflect_ManifestFactory$ByteManifest$() : ((runtimeClass1 === $d_S.l()) ? $m_s_reflect_ManifestFactory$ShortManifest$() : ((runtimeClass1 === $d_C.l()) ? $m_s_reflect_ManifestFactory$CharManifest$() : ((runtimeClass1 === $d_I.l()) ? $m_s_reflect_ManifestFactory$IntManifest$() : ((runtimeClass1 === $d_J.l()) ? $m_s_reflect_ManifestFactory$LongManifest$() : ((runtimeClass1 === $d_F.l()) ? $m_s_reflect_ManifestFactory$FloatManifest$() : ((runtimeClass1 === $d_D.l()) ? $m_s_reflect_ManifestFactory$DoubleManifest$() : ((runtimeClass1 === $d_Z.l()) ? $m_s_reflect_ManifestFactory$BooleanManifest$() : ((runtimeClass1 === $d_V.l()) ? $m_s_reflect_ManifestFactory$UnitManifest$() : ((runtimeClass1 === $d_O.l()) ? $m_s_reflect_ManifestFactory$ObjectManifest$() : ((runtimeClass1 === $d_sr_Nothing$.l()) ? $m_s_reflect_ManifestFactory$NothingManifest$() : ((runtimeClass1 === $d_sr_Null$.l()) ? $m_s_reflect_ManifestFactory$NullManifest$() : new $c_s_reflect_ClassTag$GenericClassTag(runtimeClass1)))))))))))));
});
var $d_s_reflect_ClassTag$ = new $TypeData().i($c_s_reflect_ClassTag$, "scala.reflect.ClassTag$", ({
  hr: 1
}));
var $n_s_reflect_ClassTag$;
function $m_s_reflect_ClassTag$() {
  if ((!$n_s_reflect_ClassTag$)) {
    $n_s_reflect_ClassTag$ = new $c_s_reflect_ClassTag$();
  }
  return $n_s_reflect_ClassTag$;
}
/** @constructor */
function $c_sr_Arrays$() {
}
$p = $c_sr_Arrays$.prototype = new $h_O();
$p.constructor = $c_sr_Arrays$;
/** @constructor */
function $h_sr_Arrays$() {
}
$h_sr_Arrays$.prototype = $p;
$p.qN = (function(xs, clazz) {
  var length = xs.m();
  var arr = clazz.X.U(length);
  xs.by(arr, 0, 2147483647);
  return arr;
});
var $d_sr_Arrays$ = new $TypeData().i($c_sr_Arrays$, "scala.runtime.Arrays$", ({
  hT: 1
}));
var $n_sr_Arrays$;
function $m_sr_Arrays$() {
  if ((!$n_sr_Arrays$)) {
    $n_sr_Arrays$ = new $c_sr_Arrays$();
  }
  return $n_sr_Arrays$;
}
/** @constructor */
function $c_sr_BoxesRunTime$() {
}
$p = $c_sr_BoxesRunTime$.prototype = new $h_O();
$p.constructor = $c_sr_BoxesRunTime$;
/** @constructor */
function $h_sr_BoxesRunTime$() {
}
$h_sr_BoxesRunTime$.prototype = $p;
$p.k = (function(x, y) {
  return ((x === y) || ($is_jl_Number(x) ? this.pe(x, y) : ((x instanceof $Char) ? this.pc(x, y) : ((x === null) ? (y === null) : $dp_equals__O__Z(x, y)))));
});
$p.pe = (function(xn, y) {
  if ($is_jl_Number(y)) {
    return this.pd(xn, y);
  } else if ((y instanceof $Char)) {
    if (((typeof xn) === "number")) {
      return ((+xn) === y.c);
    } else if ((xn instanceof $Long)) {
      var $x_1 = $uJ(xn);
      var x3_$_lo = $x_1.l;
      var x3_$_hi = $x_1.h;
      var value = y.c;
      var hi = (value >> 31);
      return (((x3_$_lo ^ value) | (x3_$_hi ^ hi)) === 0);
    } else {
      return ((xn === null) ? (y === null) : $dp_equals__O__Z(xn, y));
    }
  } else {
    return ((xn === null) ? (y === null) : $dp_equals__O__Z(xn, y));
  }
});
$p.pd = (function(xn, yn) {
  if (((typeof xn) === "number")) {
    var x2 = (+xn);
    if (((typeof yn) === "number")) {
      return (x2 === (+yn));
    } else if ((yn instanceof $Long)) {
      var $x_1 = $uJ(yn);
      var x3_$_lo = $x_1.l;
      var x3_$_hi = $x_1.h;
      return (x2 === ((4.294967296E9 * x3_$_hi) + (x3_$_lo >>> 0.0)));
    } else {
      return (false && yn.l(x2));
    }
  } else if ((xn instanceof $Long)) {
    var $x_2 = $uJ(xn);
    var x3$2_$_lo = $x_2.l;
    var x3$2_$_hi = $x_2.h;
    if ((yn instanceof $Long)) {
      var $x_3 = $uJ(yn);
      var x2$3_$_lo = $x_3.l;
      var x2$3_$_hi = $x_3.h;
      return (((x3$2_$_lo ^ x2$3_$_lo) | (x3$2_$_hi ^ x2$3_$_hi)) === 0);
    } else if (((typeof yn) === "number")) {
      var x3$3 = (+yn);
      return (((4.294967296E9 * x3$2_$_hi) + (x3$2_$_lo >>> 0.0)) === x3$3);
    } else {
      return (false && yn.l($bL(x3$2_$_lo, x3$2_$_hi)));
    }
  } else {
    return ((xn === null) ? (yn === null) : $dp_equals__O__Z(xn, yn));
  }
});
$p.pc = (function(xc, y) {
  if ((y instanceof $Char)) {
    return (xc.c === y.c);
  } else if ($is_jl_Number(y)) {
    if (((typeof y) === "number")) {
      return ((+y) === xc.c);
    } else if ((y instanceof $Long)) {
      var $x_1 = $uJ(y);
      var x3_$_lo = $x_1.l;
      var x3_$_hi = $x_1.h;
      var value = xc.c;
      var hi = (value >> 31);
      return (((x3_$_lo ^ value) | (x3_$_hi ^ hi)) === 0);
    } else {
      return ((y === null) ? (xc === null) : $dp_equals__O__Z(y, xc));
    }
  } else {
    return ((xc === null) && (y === null));
  }
});
var $d_sr_BoxesRunTime$ = new $TypeData().i($c_sr_BoxesRunTime$, "scala.runtime.BoxesRunTime$", ({
  hV: 1
}));
var $n_sr_BoxesRunTime$;
function $m_sr_BoxesRunTime$() {
  if ((!$n_sr_BoxesRunTime$)) {
    $n_sr_BoxesRunTime$ = new $c_sr_BoxesRunTime$();
  }
  return $n_sr_BoxesRunTime$;
}
var $d_sr_Null$ = new $TypeData().i(0, "scala.runtime.Null$", ({
  hZ: 1
}));
/** @constructor */
function $c_sr_Scala3RunTime$() {
}
$p = $c_sr_Scala3RunTime$.prototype = new $h_O();
$p.constructor = $c_sr_Scala3RunTime$;
/** @constructor */
function $h_sr_Scala3RunTime$() {
}
$h_sr_Scala3RunTime$.prototype = $p;
$p.cr = (function() {
  throw $ct_jl_NullPointerException__T__(new $c_jl_NullPointerException(), "tried to cast away nullability, but value is null");
});
var $d_sr_Scala3RunTime$ = new $TypeData().i($c_sr_Scala3RunTime$, "scala.runtime.Scala3RunTime$", ({
  i1: 1
}));
var $n_sr_Scala3RunTime$;
function $m_sr_Scala3RunTime$() {
  if ((!$n_sr_Scala3RunTime$)) {
    $n_sr_Scala3RunTime$ = new $c_sr_Scala3RunTime$();
  }
  return $n_sr_Scala3RunTime$;
}
/** @constructor */
function $c_sr_ScalaRunTime$() {
}
$p = $c_sr_ScalaRunTime$.prototype = new $h_O();
$p.constructor = $c_sr_ScalaRunTime$;
/** @constructor */
function $h_sr_ScalaRunTime$() {
}
$h_sr_ScalaRunTime$.prototype = $p;
$p.e9 = (function(xs, idx) {
  if ((xs instanceof $ac_O)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_I)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_D)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_J)) {
    var $x_1 = xs.a;
    var $x_2 = (idx << 1);
    return $bL($x_1[$x_2], $x_1[(($x_2 + 1) | 0)]);
  }
  if ((xs instanceof $ac_F)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_C)) {
    return $bC(xs.a[idx]);
  }
  if ((xs instanceof $ac_B)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_S)) {
    return xs.a[idx];
  }
  if ((xs instanceof $ac_Z)) {
    return xs.a[idx];
  }
  if ((xs === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  throw new $c_s_MatchError(xs);
});
$p.gU = (function(xs, idx, value) {
  if ((xs instanceof $ac_O)) {
    xs.a[idx] = value;
    return (void 0);
  }
  if ((xs instanceof $ac_I)) {
    xs.a[idx] = (value | 0);
    return (void 0);
  }
  if ((xs instanceof $ac_D)) {
    xs.a[idx] = (+value);
    return (void 0);
  }
  if ((xs instanceof $ac_J)) {
    var $x_1 = $uJ(value);
    var $x_2 = xs.a;
    var $x_3 = (idx << 1);
    $x_2[$x_3] = $x_1.l;
    $x_2[(($x_3 + 1) | 0)] = $x_1.h;
    return (void 0);
  }
  if ((xs instanceof $ac_F)) {
    xs.a[idx] = Math.fround(value);
    return (void 0);
  }
  if ((xs instanceof $ac_C)) {
    xs.a[idx] = $uC(value);
    return (void 0);
  }
  if ((xs instanceof $ac_B)) {
    xs.a[idx] = (value | 0);
    return (void 0);
  }
  if ((xs instanceof $ac_S)) {
    xs.a[idx] = (value | 0);
    return (void 0);
  }
  if ((xs instanceof $ac_Z)) {
    xs.a[idx] = (!(!value));
    return (void 0);
  }
  if ((xs === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  throw new $c_s_MatchError(xs);
});
$p.iA = (function(x) {
  return $f_sc_IterableOnceOps__mkString__T__T__T__T(x.bJ(), (x.b5() + "("), ",", ")");
});
$p.n8 = (function(xs) {
  return ((xs === null) ? null : $m_sci_ArraySeq$().hd(xs));
});
$p.aA = (function(xs) {
  if ((xs === null)) {
    return null;
  } else if ((xs.a.length === 0)) {
    var this$2 = $m_sci_ArraySeq$();
    $m_s_reflect_ManifestFactory$ObjectManifest$();
    return $p_sci_ArraySeq$__emptyImpl__sci_ArraySeq$ofRef(this$2);
  } else {
    return new $c_sci_ArraySeq$ofRef(xs);
  }
});
var $d_sr_ScalaRunTime$ = new $TypeData().i($c_sr_ScalaRunTime$, "scala.runtime.ScalaRunTime$", ({
  i2: 1
}));
var $n_sr_ScalaRunTime$;
function $m_sr_ScalaRunTime$() {
  if ((!$n_sr_ScalaRunTime$)) {
    $n_sr_ScalaRunTime$ = new $c_sr_ScalaRunTime$();
  }
  return $n_sr_ScalaRunTime$;
}
/** @constructor */
function $c_sr_Statics$() {
}
$p = $c_sr_Statics$.prototype = new $h_O();
$p.constructor = $c_sr_Statics$;
/** @constructor */
function $h_sr_Statics$() {
}
$h_sr_Statics$.prototype = $p;
$p.v = (function(hash, data) {
  var h = this.cV(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return ((Math.imul(5, h) - 430675100) | 0);
});
$p.cV = (function(hash, data) {
  var k = data;
  k = Math.imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = Math.imul(461845907, k);
  return (hash ^ k);
});
$p.ay = (function(hash, length) {
  return this.oB((hash ^ length));
});
$p.oB = (function(h0) {
  var h = h0;
  h = (h ^ ((h >>> 16) | 0));
  h = Math.imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = Math.imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h;
});
$p.q6 = (function(lv_$_lo, lv_$_hi) {
  return ((lv_$_hi === (lv_$_lo >> 31)) ? lv_$_lo : (lv_$_lo ^ lv_$_hi));
});
$p.p7 = (function(dv) {
  var iv = $doubleToInt(dv);
  if ((iv === dv)) {
    return iv;
  } else {
    var $x_1 = $m_RTLong$().n6(dv);
    var lv_$_lo = $x_1.l;
    var lv_$_hi = $x_1.h;
    if ((((4.294967296E9 * lv_$_hi) + (lv_$_lo >>> 0.0)) === dv)) {
      return (lv_$_lo ^ lv_$_hi);
    } else {
      var valueInt = (dv | 0);
      if (((valueInt === dv) && ((1.0 / dv) !== (-Infinity)))) {
        return valueInt;
      } else if ((dv !== dv)) {
        return 2146959360;
      } else {
        var fpBitsDataView = $fpBitsDataView;
        fpBitsDataView.setFloat64(0, dv, true);
        return ((fpBitsDataView.getInt32(0, true) | 0) ^ (fpBitsDataView.getInt32(4, true) | 0));
      }
    }
  }
});
$p.H = (function(x) {
  if ((x === null)) {
    return 0;
  } else if (((typeof x) === "number")) {
    return this.p7((+x));
  } else if ((x instanceof $Long)) {
    var $x_1 = $uJ(x);
    return this.q6($x_1.l, $x_1.h);
  } else {
    return $dp_hashCode__I(x);
  }
});
$p.pV = (function(n) {
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
var $d_sr_Statics$ = new $TypeData().i($c_sr_Statics$, "scala.runtime.Statics$", ({
  i4: 1
}));
var $n_sr_Statics$;
function $m_sr_Statics$() {
  if ((!$n_sr_Statics$)) {
    $n_sr_Statics$ = new $c_sr_Statics$();
  }
  return $n_sr_Statics$;
}
/** @constructor */
function $c_sjs_js_defined$() {
}
$p = $c_sjs_js_defined$.prototype = new $h_O();
$p.constructor = $c_sjs_js_defined$;
/** @constructor */
function $h_sjs_js_defined$() {
}
$h_sjs_js_defined$.prototype = $p;
$p.mG = (function(a) {
  return a;
});
var $d_sjs_js_defined$ = new $TypeData().i($c_sjs_js_defined$, "scala.scalajs.js.defined$", ({
  ia: 1
}));
var $n_sjs_js_defined$;
function $m_sjs_js_defined$() {
  if ((!$n_sjs_js_defined$)) {
    $n_sjs_js_defined$ = new $c_sjs_js_defined$();
  }
  return $n_sjs_js_defined$;
}
/** @constructor */
function $c_sjs_js_timers_package$() {
}
$p = $c_sjs_js_timers_package$.prototype = new $h_O();
$p.constructor = $c_sjs_js_timers_package$;
/** @constructor */
function $h_sjs_js_timers_package$() {
}
$h_sjs_js_timers_package$.prototype = $p;
$p.qW = (function(interval, body) {
  return setTimeout((() => {
    body.L();
  }), interval);
});
var $d_sjs_js_timers_package$ = new $TypeData().i($c_sjs_js_timers_package$, "scala.scalajs.js.timers.package$", ({
  ib: 1
}));
var $n_sjs_js_timers_package$;
function $m_sjs_js_timers_package$() {
  if ((!$n_sjs_js_timers_package$)) {
    $n_sjs_js_timers_package$ = new $c_sjs_js_timers_package$();
  }
  return $n_sjs_js_timers_package$;
}
/** @constructor */
function $c_sjsr_Compat$() {
}
$p = $c_sjsr_Compat$.prototype = new $h_O();
$p.constructor = $c_sjsr_Compat$;
/** @constructor */
function $h_sjsr_Compat$() {
}
$h_sjsr_Compat$.prototype = $p;
$p.r6 = (function(seq) {
  if ((seq instanceof $c_sjsr_WrappedVarArgs)) {
    return seq.gK;
  } else {
    var result = [];
    seq.bz(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$2$2) => (result.push(x$2$2) | 0))));
    return result;
  }
});
var $d_sjsr_Compat$ = new $TypeData().i($c_sjsr_Compat$, "scala.scalajs.runtime.Compat$", ({
  il: 1
}));
var $n_sjsr_Compat$;
function $m_sjsr_Compat$() {
  if ((!$n_sjsr_Compat$)) {
    $n_sjsr_Compat$ = new $c_sjsr_Compat$();
  }
  return $n_sjsr_Compat$;
}
/** @constructor */
function $c_sjsr_PrivateFieldsSymbolHolder$() {
  this.eM = null;
  $n_sjsr_PrivateFieldsSymbolHolder$ = this;
  this.eM = Symbol("privateFields");
}
$p = $c_sjsr_PrivateFieldsSymbolHolder$.prototype = new $h_O();
$p.constructor = $c_sjsr_PrivateFieldsSymbolHolder$;
/** @constructor */
function $h_sjsr_PrivateFieldsSymbolHolder$() {
}
$h_sjsr_PrivateFieldsSymbolHolder$.prototype = $p;
var $d_sjsr_PrivateFieldsSymbolHolder$ = new $TypeData().i($c_sjsr_PrivateFieldsSymbolHolder$, "scala.scalajs.runtime.PrivateFieldsSymbolHolder$", ({
  im: 1
}));
var $n_sjsr_PrivateFieldsSymbolHolder$;
function $m_sjsr_PrivateFieldsSymbolHolder$() {
  if ((!$n_sjsr_PrivateFieldsSymbolHolder$)) {
    $n_sjsr_PrivateFieldsSymbolHolder$ = new $c_sjsr_PrivateFieldsSymbolHolder$();
  }
  return $n_sjsr_PrivateFieldsSymbolHolder$;
}
/** @constructor */
function $c_s_util_control_NonFatal$() {
}
$p = $c_s_util_control_NonFatal$.prototype = new $h_O();
$p.constructor = $c_s_util_control_NonFatal$;
/** @constructor */
function $h_s_util_control_NonFatal$() {
}
$h_s_util_control_NonFatal$.prototype = $p;
$p.oy = (function(t) {
  matchAlts1: {
    matchAlts2: {
      if (false) {
        break matchAlts2;
      }
      if (false) {
        break matchAlts2;
      }
      if (false) {
        break matchAlts2;
      }
      if (false) {
        break matchAlts2;
      }
      if (false) {
        break matchAlts2;
      }
      break matchAlts1;
    }
    return false;
  }
  return true;
});
$p.gb = (function(t) {
  return (this.oy(t) ? new $c_s_Some(t) : $m_s_None$());
});
var $d_s_util_control_NonFatal$ = new $TypeData().i($c_s_util_control_NonFatal$, "scala.util.control.NonFatal$", ({
  iq: 1
}));
var $n_s_util_control_NonFatal$;
function $m_s_util_control_NonFatal$() {
  if ((!$n_s_util_control_NonFatal$)) {
    $n_s_util_control_NonFatal$ = new $c_s_util_control_NonFatal$();
  }
  return $n_s_util_control_NonFatal$;
}
/** @constructor */
function $c_s_util_hashing_MurmurHash3() {
}
$p = $c_s_util_hashing_MurmurHash3.prototype = new $h_O();
$p.constructor = $c_s_util_hashing_MurmurHash3;
/** @constructor */
function $h_s_util_hashing_MurmurHash3() {
}
$h_s_util_hashing_MurmurHash3.prototype = $p;
$p.v = (function(hash, data) {
  var h = this.cV(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return ((Math.imul(5, h) - 430675100) | 0);
});
$p.cV = (function(hash, data) {
  var k = data;
  k = Math.imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = Math.imul(461845907, k);
  return (hash ^ k);
});
$p.ay = (function(hash, length) {
  return this.g9((hash ^ length));
});
$p.g9 = (function(hash) {
  var h = hash;
  h = (h ^ ((h >>> 16) | 0));
  h = Math.imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = Math.imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h;
});
$p.nH = (function(x, y, seed) {
  var h = seed;
  h = this.v(h, $f_T__hashCode__I("Tuple2"));
  h = this.v(h, x);
  h = this.v(h, y);
  return this.ay(h, 2);
});
$p.eX = (function(x, seed, ignorePrefix) {
  var arr = x.b3();
  if ((arr === 0)) {
    return ((!ignorePrefix) ? $f_T__hashCode__I(x.b5()) : seed);
  } else {
    var h = seed;
    if ((!ignorePrefix)) {
      h = this.v(h, $f_T__hashCode__I(x.b5()));
    }
    var i = 0;
    while ((i < arr)) {
      h = this.v(h, $m_sr_Statics$().H(x.b4(i)));
      i = ((1 + i) | 0);
    }
    return this.ay(h, arr);
  }
});
$p.fV = (function(x, seed, caseClassName) {
  var arr = x.b3();
  var aye = $f_T__hashCode__I(((caseClassName !== null) ? caseClassName : x.b5()));
  if ((arr === 0)) {
    return aye;
  } else {
    var h = seed;
    h = this.v(h, aye);
    var i = 0;
    while ((i < arr)) {
      h = this.v(h, $m_sr_Statics$().H(x.b4(i)));
      i = ((1 + i) | 0);
    }
    return this.ay(h, arr);
  }
});
$p.ju = (function(xs, seed) {
  var a = 0;
  var b = 0;
  var n = 0;
  var c = 1;
  var iterator = xs.h();
  while (iterator.j()) {
    var x = iterator.i();
    var h = $m_sr_Statics$().H(x);
    a = ((a + h) | 0);
    b = (b ^ h);
    c = Math.imul(c, (1 | h));
    n = ((1 + n) | 0);
  }
  var h$2 = seed;
  h$2 = this.v(h$2, a);
  h$2 = this.v(h$2, b);
  h$2 = this.cV(h$2, c);
  return this.ay(h$2, n);
});
$p.qt = (function(xs, seed) {
  var it = xs.h();
  var h = seed;
  if ((!it.j())) {
    return this.ay(h, 0);
  }
  var x0 = it.i();
  if ((!it.j())) {
    return this.ay(this.v(h, $m_sr_Statics$().H(x0)), 1);
  }
  var x1 = it.i();
  var initial = $m_sr_Statics$().H(x0);
  h = this.v(h, initial);
  var h0 = h;
  var prev = $m_sr_Statics$().H(x1);
  var rangeDiff = ((prev - initial) | 0);
  var i = 2;
  while (it.j()) {
    h = this.v(h, prev);
    var hash = $m_sr_Statics$().H(it.i());
    if (((rangeDiff !== ((hash - prev) | 0)) || (rangeDiff === 0))) {
      h = this.v(h, hash);
      i = ((1 + i) | 0);
      while (it.j()) {
        h = this.v(h, $m_sr_Statics$().H(it.i()));
        i = ((1 + i) | 0);
      }
      return this.ay(h, i);
    }
    prev = hash;
    i = ((1 + i) | 0);
  }
  return this.g9(this.v(this.v(h0, rangeDiff), prev));
});
$p.aG = (function(a, seed) {
  var h = seed;
  var l = $m_jl_reflect_Array$().bI(a);
  switch (l) {
    case 0: {
      return this.ay(h, 0);
      break;
    }
    case 1: {
      return this.ay(this.v(h, $m_sr_Statics$().H($m_sr_ScalaRunTime$().e9(a, 0))), 1);
      break;
    }
    default: {
      var initial = $m_sr_Statics$().H($m_sr_ScalaRunTime$().e9(a, 0));
      h = this.v(h, initial);
      var h0 = h;
      var prev = $m_sr_Statics$().H($m_sr_ScalaRunTime$().e9(a, 1));
      var rangeDiff = ((prev - initial) | 0);
      var i = 2;
      while ((i < l)) {
        h = this.v(h, prev);
        var hash = $m_sr_Statics$().H($m_sr_ScalaRunTime$().e9(a, i));
        if (((rangeDiff !== ((hash - prev) | 0)) || (rangeDiff === 0))) {
          h = this.v(h, hash);
          i = ((1 + i) | 0);
          while ((i < l)) {
            h = this.v(h, $m_sr_Statics$().H($m_sr_ScalaRunTime$().e9(a, i)));
            i = ((1 + i) | 0);
          }
          return this.ay(h, l);
        }
        prev = hash;
        i = ((1 + i) | 0);
      }
      return this.g9(this.v(this.v(h0, rangeDiff), prev));
    }
  }
});
$p.qx = (function(start, step, last, seed) {
  return this.g9(this.v(this.v(this.v(seed, start), step), last));
});
$p.pM = (function(a, seed) {
  var h = seed;
  var l = a.m();
  switch (l) {
    case 0: {
      return this.ay(h, 0);
      break;
    }
    case 1: {
      return this.ay(this.v(h, $m_sr_Statics$().H(a.q(0))), 1);
      break;
    }
    default: {
      var initial = $m_sr_Statics$().H(a.q(0));
      h = this.v(h, initial);
      var h0 = h;
      var prev = $m_sr_Statics$().H(a.q(1));
      var rangeDiff = ((prev - initial) | 0);
      var i = 2;
      while ((i < l)) {
        h = this.v(h, prev);
        var hash = $m_sr_Statics$().H(a.q(i));
        if (((rangeDiff !== ((hash - prev) | 0)) || (rangeDiff === 0))) {
          h = this.v(h, hash);
          i = ((1 + i) | 0);
          while ((i < l)) {
            h = this.v(h, $m_sr_Statics$().H(a.q(i)));
            i = ((1 + i) | 0);
          }
          return this.ay(h, l);
        }
        prev = hash;
        i = ((1 + i) | 0);
      }
      return this.g9(this.v(this.v(h0, rangeDiff), prev));
    }
  }
});
$p.q5 = (function(xs, seed) {
  var n = 0;
  var h = seed;
  var rangeState = 0;
  var rangeDiff = 0;
  var prev = 0;
  var initial = 0;
  var elems = xs;
  while ((!elems.c())) {
    var head = elems.o();
    var tail = elems.s();
    var hash = $m_sr_Statics$().H(head);
    h = this.v(h, hash);
    switch (rangeState) {
      case 0: {
        initial = hash;
        rangeState = 1;
        break;
      }
      case 1: {
        rangeDiff = ((hash - prev) | 0);
        rangeState = 2;
        break;
      }
      case 2: {
        if (((rangeDiff !== ((hash - prev) | 0)) || (rangeDiff === 0))) {
          rangeState = 3;
        }
        break;
      }
    }
    prev = hash;
    n = ((1 + n) | 0);
    elems = tail;
  }
  return ((rangeState === 2) ? this.qx(initial, rangeDiff, prev, seed) : this.ay(h, n));
});
/** @constructor */
function $c_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5() {
}
$p = $c_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5.prototype = new $h_Lapp_tulz_tuplez_Composition();
$p.constructor = $c_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5;
/** @constructor */
function $h_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5() {
}
$h_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5.prototype = $p;
var $d_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5 = new $TypeData().i($c_Lapp_tulz_tuplez_Composition\uff3fPri7$$anon$5, "app.tulz.tuplez.Composition_Pri7$$anon$5", ({
  cp: 1,
  co: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_ownership_OneTimeOwner(onAccessAfterKilled) {
  this.eq = null;
  this.jZ = null;
  this.hv = false;
  this.jZ = onAccessAfterKilled;
  $f_Lcom_raquo_airstream_ownership_Owner__$init$__V(this);
  this.hv = false;
}
$p = $c_Lcom_raquo_airstream_ownership_OneTimeOwner.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_ownership_OneTimeOwner;
/** @constructor */
function $h_Lcom_raquo_airstream_ownership_OneTimeOwner() {
}
$h_Lcom_raquo_airstream_ownership_OneTimeOwner.prototype = $p;
$p.qu = (function(subscription) {
  if (this.hv) {
    $p_Lcom_raquo_airstream_ownership_Subscription__safeCleanup__V(subscription);
    this.jZ.L();
  } else {
    $f_Lcom_raquo_airstream_ownership_Owner__own__Lcom_raquo_airstream_ownership_Subscription__V(this, subscription);
  }
});
$p.q4 = (function() {
  $f_Lcom_raquo_airstream_ownership_Owner__killSubscriptions__V(this);
  this.hv = true;
});
var $d_Lcom_raquo_airstream_ownership_OneTimeOwner = new $TypeData().i($c_Lcom_raquo_airstream_ownership_OneTimeOwner, "com.raquo.airstream.ownership.OneTimeOwner", ({
  cS: 1,
  cT: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_codecs_package$$anon$2(outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_codecs_package$$anon$2.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_codecs_package$$anon$2;
/** @constructor */
function $h_Lcom_raquo_laminar_codecs_package$$anon$2() {
}
$h_Lcom_raquo_laminar_codecs_package$$anon$2.prototype = $p;
$p.fZ = (function(scalaValue) {
  return scalaValue;
});
$p.iN = (function(domValue) {
  return domValue;
});
var $d_Lcom_raquo_laminar_codecs_package$$anon$2 = new $TypeData().i($c_Lcom_raquo_laminar_codecs_package$$anon$2, "com.raquo.laminar.codecs.package$$anon$2", ({
  di: 1,
  b9: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_CompositeKey(name, getRawDomValue, setRawDomValue, separator) {
  this.l3 = null;
  this.l5 = null;
  this.l4 = null;
  this.hI = null;
  this.l3 = getRawDomValue;
  this.l5 = setRawDomValue;
  this.l4 = separator;
  this.hI = new $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec(separator);
}
$p = $c_Lcom_raquo_laminar_keys_CompositeKey.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_CompositeKey;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_CompositeKey() {
}
$h_Lcom_raquo_laminar_keys_CompositeKey.prototype = $p;
$p.eN = (function(items) {
  return new $c_Lcom_raquo_laminar_modifiers_CompositeKeySetter(this, ($m_Lcom_raquo_laminar_api_package$().w.oe(), $m_Lcom_raquo_laminar_keys_CompositeKey$().nj(items, this.l4)));
});
var $d_Lcom_raquo_laminar_keys_CompositeKey = new $TypeData().i($c_Lcom_raquo_laminar_keys_CompositeKey, "com.raquo.laminar.keys.CompositeKey", ({
  dH: 1,
  ag: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec(separator) {
  this.hJ = null;
  this.hJ = separator;
}
$p = $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec() {
}
$h_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec.prototype = $p;
$p.mR = (function(domValue) {
  return $m_Lcom_raquo_laminar_keys_CompositeKey$().nj(domValue, this.hJ);
});
$p.mU = (function(scalaValue) {
  return $f_sc_IterableOnceOps__mkString__T__T__T__T(scalaValue, "", this.hJ, "");
});
$p.iN = (function(domValue) {
  return this.mR(domValue);
});
$p.fZ = (function(scalaValue) {
  return this.mU(scalaValue);
});
var $d_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec = new $TypeData().i($c_Lcom_raquo_laminar_keys_CompositeKey$CompositeCodec, "com.raquo.laminar.keys.CompositeKey$CompositeCodec", ({
  dJ: 1,
  b9: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$(outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$() {
}
$h_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$.prototype = $p;
var $d_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$ = new $TypeData().i($c_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$, "com.raquo.laminar.keys.CompositeKey$CompositeValueMappers$StringValueMapper$", ({
  dL: 1,
  dK: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_EventProp(name) {
  this.cg = null;
  this.cg = name;
}
$p = $c_Lcom_raquo_laminar_keys_EventProp.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_EventProp;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_EventProp() {
}
$h_Lcom_raquo_laminar_keys_EventProp.prototype = $p;
var $d_Lcom_raquo_laminar_keys_EventProp = new $TypeData().i($c_Lcom_raquo_laminar_keys_EventProp, "com.raquo.laminar.keys.EventProp", ({
  dP: 1,
  ag: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_HtmlAttr(name, codec) {
  this.fh = null;
  this.hK = null;
  this.fh = name;
  this.hK = codec;
}
$p = $c_Lcom_raquo_laminar_keys_HtmlAttr.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_HtmlAttr;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_HtmlAttr() {
}
$h_Lcom_raquo_laminar_keys_HtmlAttr.prototype = $p;
$p.iz = (function(value) {
  return new $c_Lcom_raquo_laminar_modifiers_KeySetter(this, value, new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((element, attr, value$2) => {
    $m_Lcom_raquo_laminar_DomApi$().nD(element, attr, value$2);
  })));
});
var $d_Lcom_raquo_laminar_keys_HtmlAttr = new $TypeData().i($c_Lcom_raquo_laminar_keys_HtmlAttr, "com.raquo.laminar.keys.HtmlAttr", ({
  dQ: 1,
  ag: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_HtmlProp(name, codec) {
  this.bn = null;
  this.hL = null;
  this.bn = name;
  this.hL = codec;
}
$p = $c_Lcom_raquo_laminar_keys_HtmlProp.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_HtmlProp;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_HtmlProp() {
}
$h_Lcom_raquo_laminar_keys_HtmlProp.prototype = $p;
$p.od = (function(values) {
  var update = ((this.bn === "value") ? new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((element, nextValue, reason) => {
    var nextDomValue = this.hL.fZ(nextValue);
    var x = $m_Lcom_raquo_laminar_DomApi$().pB(element, this);
    if ((!((x !== (void 0)) && $m_sr_BoxesRunTime$().k(nextDomValue, x)))) {
      $m_Lcom_raquo_laminar_DomApi$().nE(element, this, nextDomValue);
    }
  })) : new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((element$2, nextValue$2, reason$2) => {
    $m_Lcom_raquo_laminar_DomApi$().qR(element$2, this, nextValue$2);
  })));
  return new $c_Lcom_raquo_laminar_modifiers_KeyUpdater(this, values.cd(), update);
});
function $isArrayOf_Lcom_raquo_laminar_keys_HtmlProp(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bb)));
}
var $d_Lcom_raquo_laminar_keys_HtmlProp = new $TypeData().i($c_Lcom_raquo_laminar_keys_HtmlProp, "com.raquo.laminar.keys.HtmlProp", ({
  bb: 1,
  ag: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_keys_SvgAttr(localName, codec, namespacePrefix) {
  this.hP = null;
  this.hO = null;
  this.gp = null;
  this.gq = null;
  this.hP = localName;
  this.hO = codec;
  var this$2 = (namespacePrefix.c() ? $m_s_None$() : new $c_s_Some(((namespacePrefix.y() + ":") + localName)));
  this.gp = (this$2.c() ? localName : this$2.y());
  this.gq = (namespacePrefix.c() ? $m_s_None$() : new $c_s_Some($m_Lcom_raquo_laminar_keys_SvgAttr$().ql(namespacePrefix.y())));
}
$p = $c_Lcom_raquo_laminar_keys_SvgAttr.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_SvgAttr;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_SvgAttr() {
}
$h_Lcom_raquo_laminar_keys_SvgAttr.prototype = $p;
var $d_Lcom_raquo_laminar_keys_SvgAttr = new $TypeData().i($c_Lcom_raquo_laminar_keys_SvgAttr, "com.raquo.laminar.keys.SvgAttr", ({
  dS: 1,
  ag: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$1() {
}
$p = $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$1.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_Modifier$$anon$1() {
}
$h_Lcom_raquo_laminar_modifiers_Modifier$$anon$1.prototype = $p;
$p.bV = (function(element) {
});
var $d_Lcom_raquo_laminar_modifiers_Modifier$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_Modifier$$anon$1, "com.raquo.laminar.modifiers.Modifier$$anon$1", ({
  e2: 1,
  W: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2(f$2, outer) {
  this.le = null;
  this.le = f$2;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_Modifier$$anon$2() {
}
$h_Lcom_raquo_laminar_modifiers_Modifier$$anon$2.prototype = $p;
$p.bV = (function(element) {
  var this$2 = $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var f = (() => {
    this.le.b(element);
  });
  $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var when = true;
  if ((this$2.b7 || (!when))) {
    f();
  } else {
    this$2.b7 = true;
    try {
      f();
    } finally {
      this$2.b7 = false;
      $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V(this$2);
    }
  }
});
var $d_Lcom_raquo_laminar_modifiers_Modifier$$anon$2 = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2, "com.raquo.laminar.modifiers.Modifier$$anon$2", ({
  e3: 1,
  W: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1() {
}
$p = $c_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1() {
}
$h_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_RenderableNode$$anon$1, "com.raquo.laminar.modifiers.RenderableNode$$anon$1", ({
  e6: 1,
  e4: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$() {
}
$p = $c_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$() {
}
$h_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$.prototype = $p;
var $d_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$ = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$, "com.raquo.laminar.modifiers.RenderableSeq$collectionSeqRenderable$", ({
  e8: 1,
  e7: 1
}));
var $n_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$;
function $m_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$() {
  if ((!$n_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$)) {
    $n_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$ = new $c_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$();
  }
  return $n_Lcom_raquo_laminar_modifiers_RenderableSeq$collectionSeqRenderable$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1(render$2, outer) {
  this.lh = null;
  this.lh = render$2;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1() {
}
$h_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1.prototype = $p;
$p.iF = (function(value) {
  return this.lh.b(value);
});
var $d_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_RenderableText$$anon$1, "com.raquo.laminar.modifiers.RenderableText$$anon$1", ({
  eb: 1,
  e9: 1
}));
function $f_Lcom_raquo_laminar_nodes_ParentNode__$init$__V($thiz) {
  $thiz.mM(new $c_Lcom_raquo_airstream_ownership_DynamicOwner(new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), ("Attempting to use owner of unmounted element: " + $f_sc_IterableOnceOps__mkString__T__T__T__T($m_Lcom_raquo_laminar_DomApi$().p3($thiz.ao(), ($m_Lcom_raquo_laminar_DomApi$(), $m_sci_Nil$())), "", " > ", "")));
  }))));
}
/** @constructor */
function $c_Lcom_raquo_laminar_tags_HtmlTag(name, void$1) {
  this.i0 = null;
  this.i0 = name;
}
$p = $c_Lcom_raquo_laminar_tags_HtmlTag.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_tags_HtmlTag;
/** @constructor */
function $h_Lcom_raquo_laminar_tags_HtmlTag() {
}
$h_Lcom_raquo_laminar_tags_HtmlTag.prototype = $p;
$p.bx = (function(modifiers) {
  var element = this.oG();
  modifiers.bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((modifier) => {
    modifier.bV(element);
  })));
  return element;
});
$p.oG = (function() {
  return new $c_Lcom_raquo_laminar_nodes_ReactiveHtmlElement(this, $m_Lcom_raquo_laminar_DomApi$().oZ(this));
});
var $d_Lcom_raquo_laminar_tags_HtmlTag = new $TypeData().i($c_Lcom_raquo_laminar_tags_HtmlTag, "com.raquo.laminar.tags.HtmlTag", ({
  en: 1,
  be: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_tags_SvgTag(name, void$1) {
  this.lj = null;
  this.lj = name;
}
$p = $c_Lcom_raquo_laminar_tags_SvgTag.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_tags_SvgTag;
/** @constructor */
function $h_Lcom_raquo_laminar_tags_SvgTag() {
}
$h_Lcom_raquo_laminar_tags_SvgTag.prototype = $p;
var $d_Lcom_raquo_laminar_tags_SvgTag = new $TypeData().i($c_Lcom_raquo_laminar_tags_SvgTag, "com.raquo.laminar.tags.SvgTag", ({
  eo: 1,
  be: 1
}));
/** @constructor */
function $c_jl_Character$() {
  this.i1 = null;
  $n_jl_Character$ = this;
  this.i1 = $constArrUDiffs_I(67, "1C]4m6m=c4]4]4]4]4]4]4]4]4]3g4]2m9]2m1Jm1m9s4g5mm6]3]4mm12>mEm1m6m1]3]=]DI]1<m24mIs4g2c4w9];]4]<]3m3m=m3mH]8]2m=mBHm3]4mK3{gggg2:g=m@]13]4E]");
}
$p = $c_jl_Character$.prototype = new $h_O();
$p.constructor = $c_jl_Character$;
/** @constructor */
function $h_jl_Character$() {
}
$h_jl_Character$.prototype = $p;
$p.jt = (function(codePoint) {
  if (((codePoint >>> 0) > 1114111)) {
    throw $ct_jl_IllegalArgumentException__(new $c_jl_IllegalArgumentException());
  }
  return String.fromCodePoint(codePoint);
});
$p.iO = (function(codePoint, radix) {
  if ((codePoint < 256)) {
    var value = (((((codePoint - 48) | 0) >>> 0) <= 9) ? ((codePoint - 48) | 0) : (((((codePoint - 65) | 0) >>> 0) <= 25) ? ((codePoint - 55) | 0) : (((((codePoint - 97) | 0) >>> 0) <= 25) ? ((codePoint - 87) | 0) : (-1))));
  } else if (((((codePoint - 65313) | 0) >>> 0) <= 25)) {
    var value = ((codePoint - 65303) | 0);
  } else if (((((codePoint - 65345) | 0) >>> 0) <= 25)) {
    var value = ((codePoint - 65335) | 0);
  } else {
    var p = $m_ju_Arrays$().oD(this.i1, codePoint);
    var zeroCodePointIndex = ((p < 0) ? (((-2) - p) | 0) : p);
    if ((zeroCodePointIndex < 0)) {
      var value = (-1);
    } else {
      var v = ((codePoint - this.i1.a[zeroCodePointIndex]) | 0);
      var value = ((v > 9) ? (-1) : v);
    }
  }
  return ((value < radix) ? value : (-1));
});
var $d_jl_Character$ = new $TypeData().i($c_jl_Character$, "java.lang.Character$", ({
  ey: 1,
  a: 1
}));
var $n_jl_Character$;
function $m_jl_Character$() {
  if ((!$n_jl_Character$)) {
    $n_jl_Character$ = new $c_jl_Character$();
  }
  return $n_jl_Character$;
}
/** @constructor */
function $c_jl_Integer$() {
}
$p = $c_jl_Integer$.prototype = new $h_O();
$p.constructor = $c_jl_Integer$;
/** @constructor */
function $h_jl_Integer$() {
}
$h_jl_Integer$.prototype = $p;
$p.g7 = (function(s) {
  throw new $c_jl_NumberFormatException((("For input string: \"" + s) + "\""));
});
$p.ne = (function(s, radix, overflowBarrier) {
  if ((s === null)) {
    $m_jl_Integer$().g7(s);
  }
  var len = s.length;
  if ((len === 0)) {
    $m_jl_Integer$().g7(s);
  }
  var character = $m_jl_Character$();
  var firstChar = s.charCodeAt(0);
  var negative = (firstChar === 45);
  var sign = (negative ? (-1) : 0);
  var i = ((negative || (firstChar === 43)) | 0);
  if ((i >= len)) {
    $m_jl_Integer$().g7(s);
  }
  var java$lang$IntFloatBits$Int32Box$$value = 0;
  java$lang$IntFloatBits$Int32Box$$value = 0;
  while ((i !== len)) {
    var x = character.iO(s.charCodeAt(i), radix);
    if (((x < 0) || ((java$lang$IntFloatBits$Int32Box$$value >>> 0) > (overflowBarrier >>> 0)))) {
      $m_jl_Integer$().g7(s);
    }
    var x$2 = java$lang$IntFloatBits$Int32Box$$value;
    var x$3 = Math.imul(x$2, radix);
    var v = ((x$3 + x) | 0);
    java$lang$IntFloatBits$Int32Box$$value = v;
    i = ((1 + i) | 0);
  }
  if (((java$lang$IntFloatBits$Int32Box$$value >>> 0) > (((2147483647 - sign) | 0) >>> 0))) {
    $m_jl_Integer$().g7(s);
  }
  return (((java$lang$IntFloatBits$Int32Box$$value ^ sign) - sign) | 0);
});
$p.dC = (function(i) {
  var t1 = ((i - (1431655765 & (i >> 1))) | 0);
  var t2 = (((858993459 & t1) + (858993459 & (t1 >> 2))) | 0);
  return (Math.imul(16843009, (252645135 & ((t2 + (t2 >> 4)) | 0))) >> 24);
});
var $d_jl_Integer$ = new $TypeData().i($c_jl_Integer$, "java.lang.Integer$", ({
  eD: 1,
  a: 1
}));
var $n_jl_Integer$;
function $m_jl_Integer$() {
  if ((!$n_jl_Integer$)) {
    $n_jl_Integer$ = new $c_jl_Integer$();
  }
  return $n_jl_Integer$;
}
/** @constructor */
function $c_jl_Long$() {
}
$p = $c_jl_Long$.prototype = new $h_O();
$p.constructor = $c_jl_Long$;
/** @constructor */
function $h_jl_Long$() {
}
$h_jl_Long$.prototype = $p;
$p.nf = (function(lo, hi) {
  if ((hi !== 0)) {
    var $x_1 = (hi >>> 0.0).toString(16);
    var s = (lo >>> 0.0).toString(16);
    var beginIndex = s.length;
    return ($x_1 + (("" + "00000000".substring(beginIndex)) + s));
  } else {
    return (lo >>> 0.0).toString(16);
  }
});
$p.q0 = (function(lo, hi) {
  var lp = (1073741823 & lo);
  var mp = (1073741823 & ((((lo >>> 30) | 0) + (hi << 2)) | 0));
  var hp = ((hi >>> 28) | 0);
  if ((hp !== 0)) {
    var $x_2 = (hp >>> 0.0).toString(8);
    var s = (mp >>> 0.0).toString(8);
    var beginIndex = s.length;
    var $x_1 = "0000000000".substring(beginIndex);
    var s$1 = (lp >>> 0.0).toString(8);
    var beginIndex$1 = s$1.length;
    return (($x_2 + (("" + $x_1) + s)) + (("" + "0000000000".substring(beginIndex$1)) + s$1));
  } else if ((mp !== 0)) {
    var $x_3 = (mp >>> 0.0).toString(8);
    var s$2 = (lp >>> 0.0).toString(8);
    var beginIndex$2 = s$2.length;
    return ($x_3 + (("" + "0000000000".substring(beginIndex$2)) + s$2));
  } else {
    return (lp >>> 0.0).toString(8);
  }
});
var $d_jl_Long$ = new $TypeData().i($c_jl_Long$, "java.lang.Long$", ({
  eG: 1,
  a: 1
}));
var $n_jl_Long$;
function $m_jl_Long$() {
  if ((!$n_jl_Long$)) {
    $n_jl_Long$ = new $c_jl_Long$();
  }
  return $n_jl_Long$;
}
/** @constructor */
function $c_jl_Number() {
}
$p = $c_jl_Number.prototype = new $h_O();
$p.constructor = $c_jl_Number;
/** @constructor */
function $h_jl_Number() {
}
$h_jl_Number.prototype = $p;
function $is_jl_Number(obj) {
  return (((obj instanceof $c_jl_Number) || ((typeof obj) === "number")) || (obj instanceof $Long));
}
function $isArrayOf_jl_Number(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ac)));
}
/** @constructor */
function $c_jl_StackTraceElement(declaringClass, methodName, fileName, lineNumber, columnNumber) {
  this.eu = null;
  this.fn = null;
  this.ev = null;
  this.ew = 0;
  this.et = 0;
  this.eu = declaringClass;
  this.fn = methodName;
  this.ev = fileName;
  this.ew = lineNumber;
  this.et = columnNumber;
}
$p = $c_jl_StackTraceElement.prototype = new $h_O();
$p.constructor = $c_jl_StackTraceElement;
/** @constructor */
function $h_jl_StackTraceElement() {
}
$h_jl_StackTraceElement.prototype = $p;
$p.l = (function(that) {
  return ((that instanceof $c_jl_StackTraceElement) && (((((this.ev === that.ev) && (this.ew === that.ew)) && (this.et === that.et)) && (this.eu === that.eu)) && (this.fn === that.fn)));
});
$p.p = (function() {
  var result = "";
  if ((this.eu !== "<jscode>")) {
    result = ((("" + result) + this.eu) + ".");
  }
  result = (("" + result) + this.fn);
  if ((this.ev === null)) {
    result = (result + "(Unknown Source)");
  } else {
    result = ((result + "(") + this.ev);
    if ((this.ew >= 0)) {
      result = ((result + ":") + this.ew);
      if ((this.et >= 0)) {
        result = ((result + ":") + this.et);
      }
    }
    result = (result + ")");
  }
  return result;
});
$p.r = (function() {
  return (((($f_T__hashCode__I(this.eu) ^ $f_T__hashCode__I(this.fn)) ^ $f_T__hashCode__I(this.ev)) ^ this.ew) ^ this.et);
});
function $isArrayOf_jl_StackTraceElement(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bm)));
}
var $d_jl_StackTraceElement = new $TypeData().i($c_jl_StackTraceElement, "java.lang.StackTraceElement", ({
  bm: 1,
  a: 1
}));
/** @constructor */
function $c_jl_String$() {
}
$p = $c_jl_String$.prototype = new $h_O();
$p.constructor = $c_jl_String$;
/** @constructor */
function $h_jl_String$() {
}
$h_jl_String$.prototype = $p;
$p.qm = (function(value, offset, count) {
  var endOffset = ((offset + count) | 0);
  var result = "";
  var i = offset;
  while ((i !== endOffset)) {
    result = (result + ("" + $cToS(value.a[i])));
    i = ((1 + i) | 0);
  }
  return result;
});
$p.pm = (function(format, args) {
  return $ct_ju_Formatter__(new $c_ju_Formatter()).pn(format, args).p();
});
var $d_jl_String$ = new $TypeData().i($c_jl_String$, "java.lang.String$", ({
  eN: 1,
  a: 1
}));
var $n_jl_String$;
function $m_jl_String$() {
  if ((!$n_jl_String$)) {
    $n_jl_String$ = new $c_jl_String$();
  }
  return $n_jl_String$;
}
function $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, e, enableSuppression, writableStackTrace) {
  $thiz.lm = s;
  $thiz.ln = writableStackTrace;
  if (writableStackTrace) {
    $thiz.pg();
  }
  return $thiz;
}
class $c_jl_Throwable extends Error {
  constructor() {
    super();
    this.lm = null;
    this.ln = false;
    this.ll = null;
    this.gu = null;
  }
  h0(cause) {
    return this;
  }
  bf() {
    return this.lm;
  }
  pg() {
    var reference = ((this instanceof $c_sjs_js_JavaScriptException) ? this.Z : this);
    this.ll = ((Object.prototype.toString.call(reference) === "[object Error]") ? reference : (((Error.captureStackTrace === (void 0)) || (!(!Object.isSealed(this)))) ? new Error() : (Error.captureStackTrace(this), this)));
    return this;
  }
  pD() {
    if ((this.gu === null)) {
      if (this.ln) {
        this.gu = $m_jl_StackTrace$().pf(this.ll);
      } else {
        this.gu = new ($d_jl_StackTraceElement.r().C)(0);
      }
    }
    return this.gu;
  }
  p() {
    var className = $objectClassName(this);
    var message = this.bf();
    return ((message === null) ? className : ((className + ": ") + message));
  }
  r() {
    return $c_O.prototype.r.call(this);
  }
  l(that) {
    return $c_O.prototype.l.call(this, that);
  }
  get "message"() {
    var m = this.bf();
    return ((m === null) ? "" : m);
  }
  get "name"() {
    return $objectClassName(this);
  }
  "toString"() {
    return this.p();
  }
}
function $isArrayOf_jl_Throwable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.n)));
}
/** @constructor */
function $c_ju_Formatter$RootLocaleInfo$() {
}
$p = $c_ju_Formatter$RootLocaleInfo$.prototype = new $h_ju_Formatter$LocaleInfo();
$p.constructor = $c_ju_Formatter$RootLocaleInfo$;
/** @constructor */
function $h_ju_Formatter$RootLocaleInfo$() {
}
$h_ju_Formatter$RootLocaleInfo$.prototype = $p;
var $d_ju_Formatter$RootLocaleInfo$ = new $TypeData().i($c_ju_Formatter$RootLocaleInfo$, "java.util.Formatter$RootLocaleInfo$", ({
  f5: 1,
  f4: 1
}));
var $n_ju_Formatter$RootLocaleInfo$;
function $m_ju_Formatter$RootLocaleInfo$() {
  if ((!$n_ju_Formatter$RootLocaleInfo$)) {
    $n_ju_Formatter$RootLocaleInfo$ = new $c_ju_Formatter$RootLocaleInfo$();
  }
  return $n_ju_Formatter$RootLocaleInfo$;
}
function $f_Lnotebook_plugin_LaminarPlugin__mount__Lorg_scalajs_dom_Element__T__Lnotebook_plugin_PluginContext__Lnotebook_plugin_PluginHandle($thiz, container, payload, ctx) {
  var current = $m_Lcom_raquo_laminar_api_package$().w.fd.gS(payload);
  return $m_Lnotebook_plugin_PluginHandle$().oz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((value) => {
    $f_Lcom_raquo_airstream_state_Var__set__O__V(current, value);
  })), new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d(((root) => (() => {
    root.r9();
  }))(($m_Lcom_raquo_laminar_api_package$(), new $c_Lcom_raquo_laminar_nodes_RootNode(container, $thiz.rd(current.cf, ctx))))));
}
/** @constructor */
function $c_s_LowPriorityImplicits() {
}
$p = $c_s_LowPriorityImplicits.prototype = new $h_s_LowPriorityImplicits2();
$p.constructor = $c_s_LowPriorityImplicits;
/** @constructor */
function $h_s_LowPriorityImplicits() {
}
$h_s_LowPriorityImplicits.prototype = $p;
$p.rg = (function(xs) {
  if ((xs === null)) {
    return null;
  } else if ((xs.a.length === 0)) {
    var this$2 = $m_scm_ArraySeq$();
    $m_s_reflect_ManifestFactory$ObjectManifest$();
    return this$2.m9;
  } else {
    return new $c_scm_ArraySeq$ofRef(xs);
  }
});
function $f_s_PartialFunction__applyOrElse__O__F1__O($thiz, x, default$1) {
  return ($thiz.c9(x) ? $thiz.b(x) : default$1.b(x));
}
/** @constructor */
function $c_sci_LazyList$Uninitialized$() {
}
$p = $c_sci_LazyList$Uninitialized$.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$Uninitialized$;
/** @constructor */
function $h_sci_LazyList$Uninitialized$() {
}
$h_sci_LazyList$Uninitialized$.prototype = $p;
var $d_sci_LazyList$Uninitialized$ = new $TypeData().i($c_sci_LazyList$Uninitialized$, "scala.collection.immutable.LazyList$Uninitialized$", ({
  gl: 1,
  a: 1
}));
var $n_sci_LazyList$Uninitialized$;
function $m_sci_LazyList$Uninitialized$() {
  if ((!$n_sci_LazyList$Uninitialized$)) {
    $n_sci_LazyList$Uninitialized$ = new $c_sci_LazyList$Uninitialized$();
  }
  return $n_sci_LazyList$Uninitialized$;
}
/** @constructor */
function $c_sci_MapNode() {
}
$p = $c_sci_MapNode.prototype = new $h_sci_Node();
$p.constructor = $c_sci_MapNode;
/** @constructor */
function $h_sci_MapNode() {
}
$h_sci_MapNode.prototype = $p;
function $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable($thiz, elems) {
  if ((elems === $thiz)) {
    $thiz.aT($m_scm_Buffer$().gY(elems));
  } else {
    var it = elems.h();
    while (it.j()) {
      $thiz.aU(it.i());
    }
  }
  return $thiz;
}
/** @constructor */
function $c_sr_AbstractFunction0() {
}
$p = $c_sr_AbstractFunction0.prototype = new $h_O();
$p.constructor = $c_sr_AbstractFunction0;
/** @constructor */
function $h_sr_AbstractFunction0() {
}
$h_sr_AbstractFunction0.prototype = $p;
$p.p = (function() {
  return "<function0>";
});
/** @constructor */
function $c_sr_AbstractFunction1() {
}
$p = $c_sr_AbstractFunction1.prototype = new $h_O();
$p.constructor = $c_sr_AbstractFunction1;
/** @constructor */
function $h_sr_AbstractFunction1() {
}
$h_sr_AbstractFunction1.prototype = $p;
$p.p = (function() {
  return "<function1>";
});
/** @constructor */
function $c_sr_AbstractFunction2() {
}
$p = $c_sr_AbstractFunction2.prototype = new $h_O();
$p.constructor = $c_sr_AbstractFunction2;
/** @constructor */
function $h_sr_AbstractFunction2() {
}
$h_sr_AbstractFunction2.prototype = $p;
$p.p = (function() {
  return "<function2>";
});
/** @constructor */
function $c_sr_AbstractFunction3() {
}
$p = $c_sr_AbstractFunction3.prototype = new $h_O();
$p.constructor = $c_sr_AbstractFunction3;
/** @constructor */
function $h_sr_AbstractFunction3() {
}
$h_sr_AbstractFunction3.prototype = $p;
$p.p = (function() {
  return "<function3>";
});
/** @constructor */
function $c_sr_BooleanRef(elem) {
  this.gH = false;
  this.gH = elem;
}
$p = $c_sr_BooleanRef.prototype = new $h_O();
$p.constructor = $c_sr_BooleanRef;
/** @constructor */
function $h_sr_BooleanRef() {
}
$h_sr_BooleanRef.prototype = $p;
$p.p = (function() {
  return ("" + this.gH);
});
var $d_sr_BooleanRef = new $TypeData().i($c_sr_BooleanRef, "scala.runtime.BooleanRef", ({
  hU: 1,
  a: 1
}));
/** @constructor */
function $c_sr_IntRef(elem) {
  this.e7 = 0;
  this.e7 = elem;
}
$p = $c_sr_IntRef.prototype = new $h_O();
$p.constructor = $c_sr_IntRef;
/** @constructor */
function $h_sr_IntRef() {
}
$h_sr_IntRef.prototype = $p;
$p.p = (function() {
  return ("" + this.e7);
});
var $d_sr_IntRef = new $TypeData().i($c_sr_IntRef, "scala.runtime.IntRef", ({
  hW: 1,
  a: 1
}));
/** @constructor */
function $c_sr_LazyRef() {
  this.gI = false;
  this.gJ = null;
}
$p = $c_sr_LazyRef.prototype = new $h_O();
$p.constructor = $c_sr_LazyRef;
/** @constructor */
function $h_sr_LazyRef() {
}
$h_sr_LazyRef.prototype = $p;
$p.pO = (function(value) {
  this.gJ = value;
  this.gI = true;
  return value;
});
$p.p = (function() {
  return ("LazyRef " + (this.gI ? ("of: " + this.gJ) : "thunk"));
});
var $d_sr_LazyRef = new $TypeData().i($c_sr_LazyRef, "scala.runtime.LazyRef", ({
  hX: 1,
  a: 1
}));
/** @constructor */
function $c_sr_ObjectRef(elem) {
  this.Y = null;
  this.Y = elem;
}
$p = $c_sr_ObjectRef.prototype = new $h_O();
$p.constructor = $c_sr_ObjectRef;
/** @constructor */
function $h_sr_ObjectRef() {
}
$h_sr_ObjectRef.prototype = $p;
$p.p = (function() {
  return ("" + this.Y);
});
var $d_sr_ObjectRef = new $TypeData().i($c_sr_ObjectRef, "scala.runtime.ObjectRef", ({
  i0: 1,
  a: 1
}));
/** @constructor */
function $c_s_util_hashing_MurmurHash3$() {
  this.ae = 0;
  this.dy = 0;
  this.mp = 0;
  this.iy = 0;
  $n_s_util_hashing_MurmurHash3$ = this;
  this.ae = $f_T__hashCode__I("Seq");
  this.dy = $f_T__hashCode__I("Map");
  this.mp = $f_T__hashCode__I("Set");
  this.iy = this.ju($m_sci_Nil$(), this.dy);
}
$p = $c_s_util_hashing_MurmurHash3$.prototype = new $h_s_util_hashing_MurmurHash3();
$p.constructor = $c_s_util_hashing_MurmurHash3$;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$() {
}
$h_s_util_hashing_MurmurHash3$.prototype = $p;
$p.ce = (function(x, y) {
  return this.nH($m_sr_Statics$().H(x), $m_sr_Statics$().H(y), (-889275714));
});
$p.nB = (function(xs) {
  return ($is_sc_IndexedSeq(xs) ? this.pM(xs, this.ae) : ((xs instanceof $c_sci_List) ? this.q5(xs, this.ae) : this.qt(xs, this.ae)));
});
$p.qd = (function(xs) {
  if (xs.c()) {
    return this.iy;
  } else {
    var accum = new $c_s_util_hashing_MurmurHash3$accum$1();
    var h = this.dy;
    xs.ec(accum);
    h = this.v(h, accum.gL);
    h = this.v(h, accum.gM);
    h = this.cV(h, accum.gN);
    return this.ay(h, accum.gO);
  }
});
var $d_s_util_hashing_MurmurHash3$ = new $TypeData().i($c_s_util_hashing_MurmurHash3$, "scala.util.hashing.MurmurHash3$", ({
  is: 1,
  ir: 1
}));
var $n_s_util_hashing_MurmurHash3$;
function $m_s_util_hashing_MurmurHash3$() {
  if ((!$n_s_util_hashing_MurmurHash3$)) {
    $n_s_util_hashing_MurmurHash3$ = new $c_s_util_hashing_MurmurHash3$();
  }
  return $n_s_util_hashing_MurmurHash3$;
}
/** @constructor */
function $c_s_util_hashing_MurmurHash3$accum$1() {
  this.gL = 0;
  this.gM = 0;
  this.gO = 0;
  this.gN = 0;
  this.gL = 0;
  this.gM = 0;
  this.gO = 0;
  this.gN = 1;
}
$p = $c_s_util_hashing_MurmurHash3$accum$1.prototype = new $h_O();
$p.constructor = $c_s_util_hashing_MurmurHash3$accum$1;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$accum$1() {
}
$h_s_util_hashing_MurmurHash3$accum$1.prototype = $p;
$p.p = (function() {
  return "<function2>";
});
$p.ox = (function(k, v) {
  var h = $m_s_util_hashing_MurmurHash3$().ce(k, v);
  this.gL = ((this.gL + h) | 0);
  this.gM = (this.gM ^ h);
  this.gN = Math.imul(this.gN, (1 | h));
  this.gO = ((1 + this.gO) | 0);
});
$p.dB = (function(v1, v2) {
  this.ox(v1, v2);
});
var $d_s_util_hashing_MurmurHash3$accum$1 = new $TypeData().i($c_s_util_hashing_MurmurHash3$accum$1, "scala.util.hashing.MurmurHash3$accum$1", ({
  it: 1,
  aK: 1
}));
/** @constructor */
function $c_Lapothecary_Main$() {
}
$p = $c_Lapothecary_Main$.prototype = new $h_O();
$p.constructor = $c_Lapothecary_Main$;
/** @constructor */
function $h_Lapothecary_Main$() {
}
$h_Lapothecary_Main$.prototype = $p;
$p.rd = (function(payload, ctx) {
  return $m_Lapothecary_Shop$().bx(new $c_sjsr_WrappedVarArgs([$m_Lapothecary_App$().re()]));
});
var $d_Lapothecary_Main$ = new $TypeData().i($c_Lapothecary_Main$, "apothecary.Main$", ({
  cl: 1,
  fi: 1,
  fh: 1
}));
var $n_Lapothecary_Main$;
function $m_Lapothecary_Main$() {
  if ((!$n_Lapothecary_Main$)) {
    $n_Lapothecary_Main$ = new $c_Lapothecary_Main$();
  }
  return $n_Lapothecary_Main$;
}
class $c_Lcom_raquo_airstream_core_AirstreamError extends $c_jl_Throwable {
}
/** @constructor */
function $c_Lcom_raquo_airstream_core_AirstreamError$() {
  this.hk = null;
  this.jH = null;
  this.jI = null;
  $n_Lcom_raquo_airstream_core_AirstreamError$ = this;
  this.hk = $m_scm_Buffer$().mH($m_sr_ScalaRunTime$().aA(new ($d_F1.r().C)([])));
  this.jH = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((err) => {
    try {
      console.error(((this.dH(err) + "\n") + this.pC(err, "\n")));
    } catch (e) {
      var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
      console.error("Error in AirstreamError.consoleErrorCallback:");
      console.error(e$2);
    }
  }));
  this.jI = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((err$2) => {
    console.warn("Using unsafe rethrow error callback. Note: other registered error callbacks might not run. Use with caution.");
    var $x_1 = err$2;
    throw (($x_1 instanceof $c_sjs_js_JavaScriptException) ? $x_1.Z : $x_1);
  }));
  this.qy(this.jH);
}
$p = $c_Lcom_raquo_airstream_core_AirstreamError$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_AirstreamError$;
/** @constructor */
function $h_Lcom_raquo_airstream_core_AirstreamError$() {
}
$h_Lcom_raquo_airstream_core_AirstreamError$.prototype = $p;
$p.dH = (function(e) {
  try {
    var errorMessage = e.bf();
  } catch (e$2) {
    var errorMessage = "(Unable to get the message for this error - exception occurred in its getMessage)";
  }
  return (($objectGetClass(e).j3() + ": ") + errorMessage);
});
$p.pC = (function(err, newline) {
  try {
    return $f_sc_IterableOnceOps__mkString__T__T__T__T($m_s_Predef$().rg(err.pD()), "", newline, "");
  } catch (e) {
    return "(Unable to get the stacktrace for this error - exception occurred in its getStackTrace)";
  }
});
$p.oO = (function(message, cause) {
  return ((message + "; cause: ") + (cause.c() ? $m_s_None$() : new $c_s_Some(this.dH(cause.y()))));
});
$p.oN = (function(causes) {
  return ("CombinedError: " + $f_sc_IterableOnceOps__mkString__T__T__T__T(causes.eb($m_s_$less$colon$less$().ex).K(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((e) => this.dH(e)))), "", "; ", ""));
});
$p.qy = (function(fn) {
  this.hk.aU(fn);
});
$p.cc = (function(err) {
  var this$1 = this.hk;
  var it = this$1.h();
  while (it.j()) {
    var x0 = it.i();
    try {
      x0.b(err);
    } catch (e) {
      var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
      var x$2 = this.jI;
      if (((x0 === null) ? (x$2 === null) : x0.l(x$2))) {
        throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
      }
      console.warn("Error processing an unhandled error callback:");
      $m_sjs_js_timers_package$().qW(0.0, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d(((e$2) => (() => {
        throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
      }))(e$2)));
    }
  }
});
var $d_Lcom_raquo_airstream_core_AirstreamError$ = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$, "com.raquo.airstream.core.AirstreamError$", ({
  cA: 1,
  ho: 1,
  hp: 1
}));
var $n_Lcom_raquo_airstream_core_AirstreamError$;
function $m_Lcom_raquo_airstream_core_AirstreamError$() {
  if ((!$n_Lcom_raquo_airstream_core_AirstreamError$)) {
    $n_Lcom_raquo_airstream_core_AirstreamError$ = new $c_Lcom_raquo_airstream_core_AirstreamError$();
  }
  return $n_Lcom_raquo_airstream_core_AirstreamError$;
}
function $f_Lcom_raquo_airstream_core_BaseObservable__$init$__V($thiz) {
  $thiz.g3(true);
  $thiz.h5((void 0));
}
function $f_Lcom_raquo_airstream_core_BaseObservable__foreach__F1__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz, onNext, owner) {
  return $f_Lcom_raquo_airstream_core_WritableObservable__addObserver__Lcom_raquo_airstream_core_Observer__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz, $m_Lcom_raquo_airstream_core_Observer$().he(onNext, $m_s_PartialFunction$().ey, true), owner);
}
function $f_Lcom_raquo_airstream_core_BaseObservable__removeExternalObserver__Lcom_raquo_airstream_core_Observer__V($thiz, observer) {
  if ($thiz.h1()) {
    $f_Lcom_raquo_airstream_core_WritableObservable__removeExternalObserverNow__Lcom_raquo_airstream_core_Observer__V($thiz, observer);
  } else {
    $f_Lcom_raquo_airstream_core_BaseObservable__getOrCreatePendingObserverRemovals__Lcom_raquo_ew_JsArray($thiz).push(new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
      $f_Lcom_raquo_airstream_core_WritableObservable__removeExternalObserverNow__Lcom_raquo_airstream_core_Observer__V($thiz, observer);
    })));
  }
}
function $f_Lcom_raquo_airstream_core_BaseObservable__removeInternalObserver__Lcom_raquo_airstream_core_InternalObserver__V($thiz, observer) {
  if ($thiz.h1()) {
    $f_Lcom_raquo_airstream_core_WritableObservable__removeInternalObserverNow__Lcom_raquo_airstream_core_InternalObserver__V($thiz, observer);
  } else {
    $f_Lcom_raquo_airstream_core_BaseObservable__getOrCreatePendingObserverRemovals__Lcom_raquo_ew_JsArray($thiz).push(new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
      $f_Lcom_raquo_airstream_core_WritableObservable__removeInternalObserverNow__Lcom_raquo_airstream_core_InternalObserver__V($thiz, observer);
    })));
  }
}
function $f_Lcom_raquo_airstream_core_BaseObservable__isStarted__Z($thiz) {
  return ($f_Lcom_raquo_airstream_core_WritableObservable__numAllObservers__I($thiz) > 0);
}
function $f_Lcom_raquo_airstream_core_BaseObservable__getOrCreatePendingObserverRemovals__Lcom_raquo_ew_JsArray($thiz) {
  var x = $thiz.h4();
  if ((x === (void 0))) {
    var newArray = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_F0.r().C)([])));
    $thiz.h5(newArray);
    return newArray;
  } else {
    return x;
  }
}
var $d_Lcom_raquo_airstream_core_Observer = new $TypeData().i(1, "com.raquo.airstream.core.Observer", ({
  av: 1,
  ao: 1,
  a4: 1
}));
function $f_Lcom_raquo_laminar_api_Implicits__textToTextNode__O__Lcom_raquo_laminar_modifiers_RenderableText__Lcom_raquo_laminar_nodes_TextNode($thiz, value, r) {
  return new $c_Lcom_raquo_laminar_nodes_TextNode(r.iF(value));
}
function $f_Lcom_raquo_laminar_api_Implicits__seqToModifier__O__F1__Lcom_raquo_laminar_modifiers_RenderableSeq__Lcom_raquo_laminar_modifiers_Modifier($thiz, modifiers, asModifier, renderableSeq) {
  return new $c_Lcom_raquo_laminar_modifiers_Modifier$$anon$2(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((element) => {
    ($m_Lcom_raquo_laminar_Seq$(), new $c_Lcom_raquo_laminar_Seq(modifiers, null, null)).bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((element$2) => ((_$6) => {
      asModifier.b(_$6).bV(element$2);
    }))(element)));
  })), $m_Lcom_raquo_laminar_modifiers_Modifier$());
}
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_Binder$$anon$1(fn$3, outer) {
  this.l7 = null;
  this.l7 = fn$3;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_modifiers_Binder$$anon$1.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_Binder$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_Binder$$anon$1() {
}
$h_Lcom_raquo_laminar_modifiers_Binder$$anon$1.prototype = $p;
$p.bV = (function(element) {
  this.fU(element);
});
$p.fU = (function(element) {
  return this.l7.b(element);
});
var $d_Lcom_raquo_laminar_modifiers_Binder$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_Binder$$anon$1, "com.raquo.laminar.modifiers.Binder$$anon$1", ({
  dW: 1,
  W: 1,
  aG: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_CompositeKeySetter(key, itemsToAdd) {
  this.l8 = null;
  this.hQ = null;
  this.l8 = key;
  this.hQ = itemsToAdd;
}
$p = $c_Lcom_raquo_laminar_modifiers_CompositeKeySetter.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_CompositeKeySetter;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_CompositeKeySetter() {
}
$h_Lcom_raquo_laminar_modifiers_CompositeKeySetter.prototype = $p;
$p.bV = (function(element) {
  if ((!this.hQ.c())) {
    $f_Lcom_raquo_laminar_nodes_ReactiveElement__updateCompositeValue__Lcom_raquo_laminar_keys_CompositeKey__Lcom_raquo_laminar_modifiers_Modifier__sci_List__sci_List__V(element, this.l8, null, this.hQ, $m_sci_Nil$());
  }
});
var $d_Lcom_raquo_laminar_modifiers_CompositeKeySetter = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_CompositeKeySetter, "com.raquo.laminar.modifiers.CompositeKeySetter", ({
  dX: 1,
  W: 1,
  bc: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_EventListener(eventProcessor, callback) {
  this.bZ = null;
  this.l9 = null;
  this.hR = null;
  this.hS = null;
  this.bZ = eventProcessor;
  this.l9 = callback;
  this.hR = ((ev) => {
    var processor = eventProcessor.fe;
    var this$2 = processor.b(ev);
    if ((!this$2.c())) {
      callback.b(this$2.y());
    }
  });
  this.hS = (() => {
    var outer = null;
    outer = this;
    var this$3 = ({});
    if ((outer === null)) {
      throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
    }
    this$3.capture = outer.bZ.fg;
    this$3.passive = outer.bZ.ff;
    return this$3;
  })();
}
$p = $c_Lcom_raquo_laminar_modifiers_EventListener.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_EventListener;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_EventListener() {
}
$h_Lcom_raquo_laminar_modifiers_EventListener.prototype = $p;
$p.bV = (function(element) {
  this.mI(element, false);
});
$p.mI = (function(element, unsafePrepend) {
  if (($f_Lcom_raquo_laminar_nodes_ReactiveElement__indexOfEventListener__Lcom_raquo_laminar_modifiers_EventListener__I(element, this) === (-1))) {
    var subscribe = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((ctx) => {
      $m_Lcom_raquo_laminar_DomApi$().mx(element.I, this);
      return new $c_Lcom_raquo_airstream_ownership_Subscription(ctx.fi, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
        var listenerIndex = $f_Lcom_raquo_laminar_nodes_ReactiveElement__indexOfEventListener__Lcom_raquo_laminar_modifiers_EventListener__I(element, this);
        if ((listenerIndex !== (-1))) {
          $f_Lcom_raquo_laminar_nodes_ReactiveElement__removeEventListener__I__V(element, listenerIndex);
          $m_Lcom_raquo_laminar_DomApi$().nr(element.I, this);
        }
      })));
    }));
    var sub = (unsafePrepend ? $m_Lcom_raquo_laminar_nodes_ReactiveElement$().ra(element, subscribe) : $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => subscribe.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element, owner)))), false));
    $f_Lcom_raquo_laminar_nodes_ReactiveElement__addEventListener__Lcom_raquo_laminar_modifiers_EventListener__Z__V(element, this, unsafePrepend);
    return sub;
  } else {
    var activate = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => (void 0)));
    return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().nG(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner$1) => {
      activate.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element, owner$1));
    })), false);
  }
});
$p.p = (function() {
  return (("EventListener(" + this.bZ.bY.cg) + ")");
});
var $d_Lcom_raquo_laminar_modifiers_EventListener = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_EventListener, "com.raquo.laminar.modifiers.EventListener", ({
  dY: 1,
  W: 1,
  aG: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_KeySetter(key, value, action) {
  this.lb = null;
  this.lc = null;
  this.la = null;
  this.lb = key;
  this.lc = value;
  this.la = action;
}
$p = $c_Lcom_raquo_laminar_modifiers_KeySetter.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_KeySetter;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_KeySetter() {
}
$h_Lcom_raquo_laminar_modifiers_KeySetter.prototype = $p;
$p.bV = (function(element) {
  this.la.gR(element, this.lb, this.lc);
});
var $d_Lcom_raquo_laminar_modifiers_KeySetter = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_KeySetter, "com.raquo.laminar.modifiers.KeySetter", ({
  dZ: 1,
  W: 1,
  bc: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_modifiers_KeyUpdater(key, values, update) {
  this.dV = null;
  this.hT = null;
  this.ld = null;
  this.dV = key;
  this.hT = values;
  this.ld = update;
}
$p = $c_Lcom_raquo_laminar_modifiers_KeyUpdater.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_modifiers_KeyUpdater;
/** @constructor */
function $h_Lcom_raquo_laminar_modifiers_KeyUpdater() {
}
$h_Lcom_raquo_laminar_modifiers_KeyUpdater.prototype = $p;
$p.bV = (function(element) {
  this.fU(element);
});
$p.fU = (function(element) {
  element.qq(this.dV);
  var observable = this.hT;
  var onNext = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((value) => {
    this.ld.gR(element, value, this);
  }));
  return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().qY(element.bK, observable, onNext);
});
var $d_Lcom_raquo_laminar_modifiers_KeyUpdater = new $TypeData().i($c_Lcom_raquo_laminar_modifiers_KeyUpdater, "com.raquo.laminar.modifiers.KeyUpdater", ({
  e0: 1,
  W: 1,
  aG: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_RootNode(container, child) {
  this.gs = null;
  this.hY = null;
  this.li = null;
  this.hY = child;
  $f_Lcom_raquo_laminar_nodes_ParentNode__$init$__V(this);
  if ((container === null)) {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Unable to mount Laminar RootNode into a null container. See https://laminar.dev/documentation#waiting-for-the-dom-to-load");
  }
  if ((!$m_Lcom_raquo_laminar_DomApi$().pZ(container, document))) {
    throw $ct_jl_Exception__T__(new $c_jl_Exception(), "Unable to mount Laminar RootNode into an unmounted container. See https://laminar.dev/documentation#rendering");
  }
  this.li = container;
  this.qk();
}
$p = $c_Lcom_raquo_laminar_nodes_RootNode.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_RootNode;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_RootNode() {
}
$h_Lcom_raquo_laminar_nodes_RootNode.prototype = $p;
$p.gX = (function() {
  return this.gs;
});
$p.mM = (function(x$0) {
  this.gs = x$0;
});
$p.qk = (function() {
  this.gs.ms();
  return $m_Lcom_raquo_laminar_nodes_ParentNode$().fK(this, this.hY, (void 0));
});
$p.r9 = (function() {
  this.gs.mQ();
  return $m_Lcom_raquo_laminar_nodes_ParentNode$().np(this, this.hY);
});
$p.ao = (function() {
  return this.li;
});
var $d_Lcom_raquo_laminar_nodes_RootNode = new $TypeData().i($c_Lcom_raquo_laminar_nodes_RootNode, "com.raquo.laminar.nodes.RootNode", ({
  eh: 1,
  ax: 1,
  bd: 1
}));
function $isArrayOf_Lcom_raquo_laminar_tags_CustomHtmlTag(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.em)));
}
function $p_jl_Class__computeCachedSimpleNameBestEffort__T($thiz) {
  if ($thiz.X.Z) {
    return ($thiz.X.Q().j3() + "[]");
  } else {
    var name = $thiz.X.N;
    var idx = ((name.length - 1) | 0);
    while (((idx >= 0) && (name.charCodeAt(idx) === 36))) {
      idx = ((idx - 1) | 0);
    }
    if (((idx >= 0) && ((((name.charCodeAt(idx) - 48) | 0) >>> 0) <= 9))) {
      idx = ((idx - 1) | 0);
      while (((idx >= 0) && ((((name.charCodeAt(idx) - 48) | 0) >>> 0) <= 9))) {
        idx = ((idx - 1) | 0);
      }
      while (((idx >= 0) && (name.charCodeAt(idx) === 36))) {
        idx = ((idx - 1) | 0);
      }
    }
    while (true) {
      if ((idx >= 0)) {
        var index$4 = idx;
        var currChar = name.charCodeAt(index$4);
        var $x_1 = ((currChar !== 36) && (currChar !== 46));
      } else {
        var $x_1 = false;
      }
      if ($x_1) {
        idx = ((idx - 1) | 0);
      } else {
        break;
      }
    }
    var beginIndex = ((1 + idx) | 0);
    return name.substring(beginIndex);
  }
}
/** @constructor */
function $c_jl_Class($data) {
  this.i2 = null;
  this.X = $data;
}
$p = $c_jl_Class.prototype = new $h_O();
$p.constructor = $c_jl_Class;
/** @constructor */
function $h_jl_Class() {
}
$h_jl_Class.prototype = $p;
$p.p = (function() {
  return ((this.X.Y ? "interface " : (this.X.X ? "" : "class ")) + this.X.N);
});
$p.j3 = (function() {
  if ((this.i2 === null)) {
    this.i2 = $p_jl_Class__computeCachedSimpleNameBestEffort__T(this);
  }
  return this.i2;
});
var $d_jl_Class = new $TypeData().i($c_jl_Class, "java.lang.Class", ({
  ez: 1,
  a: 1,
  a2: 1
}));
class $c_jl_Error extends $c_jl_Throwable {
}
function $ct_jl_Exception__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
class $c_jl_Exception extends $c_jl_Throwable {
}
var $d_jl_Exception = new $TypeData().i($c_jl_Exception, "java.lang.Exception", ({
  t: 1,
  n: 1,
  a: 1
}));
/** @constructor */
function $c_s_$less$colon$less() {
}
$p = $c_s_$less$colon$less.prototype = new $h_O();
$p.constructor = $c_s_$less$colon$less;
/** @constructor */
function $h_s_$less$colon$less() {
}
$h_s_$less$colon$less.prototype = $p;
/** @constructor */
function $c_s_Predef$() {
  this.nW = null;
  $n_s_Predef$ = this;
  $m_sci_List$();
  this.nW = $m_sci_Map$();
}
$p = $c_s_Predef$.prototype = new $h_s_LowPriorityImplicits();
$p.constructor = $c_s_Predef$;
/** @constructor */
function $h_s_Predef$() {
}
$h_s_Predef$.prototype = $p;
$p.qG = (function(requirement) {
  if ((!requirement)) {
    throw $ct_jl_IllegalArgumentException__T__(new $c_jl_IllegalArgumentException(), "requirement failed");
  }
});
var $d_s_Predef$ = new $TypeData().i($c_s_Predef$, "scala.Predef$", ({
  fz: 1,
  ft: 1,
  fu: 1
}));
var $n_s_Predef$;
function $m_s_Predef$() {
  if ((!$n_s_Predef$)) {
    $n_s_Predef$ = new $c_s_Predef$();
  }
  return $n_s_Predef$;
}
function $f_s_Product2__productElement__I__O($thiz, n) {
  switch (n) {
    case 0: {
      return $thiz.b8;
      break;
    }
    case 1: {
      return $thiz.aW;
      break;
    }
    default: {
      throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), (n + " is out of bounds (min 0, max 1)"));
    }
  }
}
function $f_s_Product3__productElement__I__O($thiz, n) {
  switch (n) {
    case 0: {
      return $thiz.eA;
      break;
    }
    case 1: {
      return $thiz.eB;
      break;
    }
    case 2: {
      return $thiz.eC;
      break;
    }
    default: {
      throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), (n + " is out of bounds (min 0, max 2)"));
    }
  }
}
function $ct_sc_ClassTagIterableFactory$AnyIterableDelegate__sc_ClassTagIterableFactory__($thiz, delegate) {
  $thiz.fq = delegate;
  return $thiz;
}
/** @constructor */
function $c_sc_ClassTagIterableFactory$AnyIterableDelegate() {
  this.fq = null;
}
$p = $c_sc_ClassTagIterableFactory$AnyIterableDelegate.prototype = new $h_O();
$p.constructor = $c_sc_ClassTagIterableFactory$AnyIterableDelegate;
/** @constructor */
function $h_sc_ClassTagIterableFactory$AnyIterableDelegate() {
}
$h_sc_ClassTagIterableFactory$AnyIterableDelegate.prototype = $p;
$p.aa = (function(it) {
  return this.fq.iU(it, $m_s_reflect_ManifestFactory$AnyManifest$());
});
$p.aH = (function() {
  return this.fq.h6($m_s_reflect_ManifestFactory$AnyManifest$());
});
$p.cP = (function(elems) {
  return this.fq.iU(elems, $m_s_reflect_ManifestFactory$AnyManifest$());
});
function $ct_sc_IterableFactory$Delegate__sc_IterableFactory__($thiz, delegate) {
  $thiz.gx = delegate;
  return $thiz;
}
/** @constructor */
function $c_sc_IterableFactory$Delegate() {
  this.gx = null;
}
$p = $c_sc_IterableFactory$Delegate.prototype = new $h_O();
$p.constructor = $c_sc_IterableFactory$Delegate;
/** @constructor */
function $h_sc_IterableFactory$Delegate() {
}
$h_sc_IterableFactory$Delegate.prototype = $p;
$p.aa = (function(it) {
  return this.gx.aa(it);
});
$p.aH = (function() {
  return this.gx.aH();
});
function $f_sc_IterableOps__headOption__s_Option($thiz) {
  var it = $thiz.h();
  return (it.j() ? new $c_s_Some(it.i()) : $m_s_None$());
}
function $f_sc_IterableOps__sizeCompare__I__I($thiz, otherSize) {
  if ((otherSize < 0)) {
    return 1;
  } else {
    var known = $thiz.u();
    if ((known >= 0)) {
      return ((known === otherSize) ? 0 : ((known < otherSize) ? (-1) : 1));
    } else {
      var i = 0;
      var it = $thiz.h();
      while (it.j()) {
        if ((i === otherSize)) {
          return 1;
        }
        it.i();
        i = ((1 + i) | 0);
      }
      return ((i - otherSize) | 0);
    }
  }
}
function $f_sc_IterableOps__map__F1__O($thiz, f) {
  return $thiz.b1().aa($ct_sc_View$Map__sc_IterableOps__F1__(new $c_sc_View$Map(), $thiz, f));
}
function $f_sc_Iterator__concat__F0__sc_Iterator($thiz, xs) {
  return new $c_sc_Iterator$ConcatIterator($thiz).iK(xs);
}
function $f_sc_Iterator__sliceIterator__I__I__sc_Iterator($thiz, from, until) {
  var lo = ((from > 0) ? from : 0);
  var rest = ((until < 0) ? (-1) : ((until <= lo) ? 0 : ((until - lo) | 0)));
  return ((rest === 0) ? $m_sc_Iterator$().P : new $c_sc_Iterator$SliceIterator($thiz, lo, rest));
}
function $f_sc_Iterator__sameElements__sc_IterableOnce__Z($thiz, that) {
  var those = that.h();
  while ($thiz.j()) {
    if ((!those.j())) {
      return false;
    }
    if ((!$m_sr_BoxesRunTime$().k($thiz.i(), those.i()))) {
      return false;
    }
  }
  return (!those.j());
}
/** @constructor */
function $c_sc_Iterator$() {
  this.P = null;
  $n_sc_Iterator$ = this;
  this.P = new $c_sc_Iterator$$anon$19();
}
$p = $c_sc_Iterator$.prototype = new $h_O();
$p.constructor = $c_sc_Iterator$;
/** @constructor */
function $h_sc_Iterator$() {
}
$h_sc_Iterator$.prototype = $p;
$p.aH = (function() {
  return new $c_sc_Iterator$$anon$21();
});
$p.aa = (function(source) {
  return source.h();
});
var $d_sc_Iterator$ = new $TypeData().i($c_sc_Iterator$, "scala.collection.Iterator$", ({
  fM: 1,
  a: 1,
  G: 1
}));
var $n_sc_Iterator$;
function $m_sc_Iterator$() {
  if ((!$n_sc_Iterator$)) {
    $n_sc_Iterator$ = new $c_sc_Iterator$();
  }
  return $n_sc_Iterator$;
}
function $ct_sc_MapFactory$Delegate__sc_MapFactory__($thiz, delegate) {
  $thiz.id = delegate;
  return $thiz;
}
/** @constructor */
function $c_sc_MapFactory$Delegate() {
  this.id = null;
}
$p = $c_sc_MapFactory$Delegate.prototype = new $h_O();
$p.constructor = $c_sc_MapFactory$Delegate;
/** @constructor */
function $h_sc_MapFactory$Delegate() {
}
$h_sc_MapFactory$Delegate.prototype = $p;
$p.aa = (function(it) {
  return this.id.aa(it);
});
/** @constructor */
function $c_sc_View$() {
}
$p = $c_sc_View$.prototype = new $h_O();
$p.constructor = $c_sc_View$;
/** @constructor */
function $h_sc_View$() {
}
$h_sc_View$.prototype = $p;
$p.n3 = (function(it) {
  return ($is_sc_View(it) ? it : ($is_sc_Iterable(it) ? new $c_sc_View$$anon$1(new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c(((it$2) => (() => it$2.h()))(it))) : $ct_sc_SeqView$Id__sc_SeqOps__(new $c_sc_SeqView$Id(), $m_sci_LazyList$().iX(it))));
});
$p.aH = (function() {
  return new $c_scm_Builder$$anon$1(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((it$2) => this.n3(it$2))), ($m_scm_ArrayBuffer$(), new $c_scm_ArrayBuffer$$anon$1()));
});
$p.aa = (function(source) {
  return this.n3(source);
});
var $d_sc_View$ = new $TypeData().i($c_sc_View$, "scala.collection.View$", ({
  g1: 1,
  a: 1,
  G: 1
}));
var $n_sc_View$;
function $m_sc_View$() {
  if ((!$n_sc_View$)) {
    $n_sc_View$ = new $c_sc_View$();
  }
  return $n_sc_View$;
}
/** @constructor */
function $c_sci_BitmapIndexedMapNode(dataMap, nodeMap, content, originalHashes, size, cachedJavaKeySetHashCode) {
  this.Q = 0;
  this.ab = 0;
  this.af = null;
  this.bp = null;
  this.aL = 0;
  this.bg = 0;
  this.Q = dataMap;
  this.ab = nodeMap;
  this.af = content;
  this.bp = originalHashes;
  this.aL = size;
  this.bg = cachedJavaKeySetHashCode;
}
$p = $c_sci_BitmapIndexedMapNode.prototype = new $h_sci_MapNode();
$p.constructor = $c_sci_BitmapIndexedMapNode;
/** @constructor */
function $h_sci_BitmapIndexedMapNode() {
}
$h_sci_BitmapIndexedMapNode.prototype = $p;
$p.aJ = (function() {
  return this.aL;
});
$p.dE = (function() {
  return this.bg;
});
$p.dI = (function(index) {
  return this.af.a[(index << 1)];
});
$p.cU = (function(index) {
  return this.af.a[((1 + (index << 1)) | 0)];
});
$p.na = (function(index) {
  return new $c_T2(this.af.a[(index << 1)], this.af.a[((1 + (index << 1)) | 0)]);
});
$p.g2 = (function(index) {
  return this.bp.a[index];
});
$p.cS = (function(index) {
  return this.af.a[((((this.af.a.length - 1) | 0) - index) | 0)];
});
$p.iD = (function(key, originalHash, keyHash, shift) {
  var mask = $m_sci_Node$().ef(keyHash, shift);
  var bitpos = $m_sci_Node$().dD(mask);
  if (((this.Q & bitpos) !== 0)) {
    var index = $m_sci_Node$().cq(this.Q, mask, bitpos);
    if ($m_sr_BoxesRunTime$().k(key, this.dI(index))) {
      return this.cU(index);
    } else {
      throw new $c_ju_NoSuchElementException(("key not found: " + key));
    }
  } else if (((this.ab & bitpos) !== 0)) {
    return this.cS($m_sci_Node$().cq(this.ab, mask, bitpos)).iD(key, originalHash, keyHash, ((5 + shift) | 0));
  } else {
    throw new $c_ju_NoSuchElementException(("key not found: " + key));
  }
});
$p.j1 = (function(key, originalHash, keyHash, shift, f) {
  var mask = $m_sci_Node$().ef(keyHash, shift);
  var bitpos = $m_sci_Node$().dD(mask);
  if (((this.Q & bitpos) !== 0)) {
    var index = $m_sci_Node$().cq(this.Q, mask, bitpos);
    return ($m_sr_BoxesRunTime$().k(key, this.dI(index)) ? this.cU(index) : f.L());
  } else {
    return (((this.ab & bitpos) !== 0) ? this.cS($m_sci_Node$().cq(this.ab, mask, bitpos)).j1(key, originalHash, keyHash, ((5 + shift) | 0), f) : f.L());
  }
});
$p.iL = (function(key, originalHash, keyHash, shift) {
  var mask = $m_sci_Node$().ef(keyHash, shift);
  var bitpos = $m_sci_Node$().dD(mask);
  if (((this.Q & bitpos) !== 0)) {
    var index = $m_sci_Node$().cq(this.Q, mask, bitpos);
    return ((this.bp.a[index] === originalHash) && $m_sr_BoxesRunTime$().k(key, this.dI(index)));
  } else {
    return (((this.ab & bitpos) !== 0) && this.cS($m_sci_Node$().cq(this.ab, mask, bitpos)).iL(key, originalHash, keyHash, ((5 + shift) | 0)));
  }
});
$p.nJ = (function(key, value, originalHash, keyHash, shift, replaceValue) {
  var mask = $m_sci_Node$().ef(keyHash, shift);
  var bitpos = $m_sci_Node$().dD(mask);
  if (((this.Q & bitpos) !== 0)) {
    var index = $m_sci_Node$().cq(this.Q, mask, bitpos);
    var key0 = this.dI(index);
    var key0UnimprovedHash = this.g2(index);
    if (((key0UnimprovedHash === originalHash) && $m_sr_BoxesRunTime$().k(key0, key))) {
      if (replaceValue) {
        var value0 = this.cU(index);
        return ((Object.is(key0, key) && Object.is(value0, value)) ? this : this.oX(bitpos, key, value));
      } else {
        return this;
      }
    } else {
      var value0$2 = this.cU(index);
      var key0Hash = $m_sc_Hashing$().c8(key0UnimprovedHash);
      return this.oV(bitpos, key0Hash, this.jg(key0, value0$2, key0UnimprovedHash, key0Hash, key, value, originalHash, keyHash, ((5 + shift) | 0)));
    }
  } else if (((this.ab & bitpos) !== 0)) {
    var index$2 = $m_sci_Node$().cq(this.ab, mask, bitpos);
    var subNode = this.cS(index$2);
    var subNodeNew$2 = subNode.nK(key, value, originalHash, keyHash, ((5 + shift) | 0), replaceValue);
    return ((subNodeNew$2 === subNode) ? this : this.oW(bitpos, subNode, subNodeNew$2));
  } else {
    return this.oU(bitpos, key, originalHash, keyHash, value);
  }
});
$p.jg = (function(key0, value0, originalHash0, keyHash0, key1, value1, originalHash1, keyHash1, shift) {
  if ((shift >= 32)) {
    return new $c_sci_HashCollisionMapNode(originalHash0, keyHash0, $m_sci_Vector$().iY(new $c_sjsr_WrappedVarArgs([new $c_T2(key0, value0), new $c_T2(key1, value1)])));
  } else {
    var mask0 = $m_sci_Node$().ef(keyHash0, shift);
    var mask1 = $m_sci_Node$().ef(keyHash1, shift);
    var newCachedHash = ((keyHash0 + keyHash1) | 0);
    if ((mask0 !== mask1)) {
      var dataMap = ($m_sci_Node$().dD(mask0) | $m_sci_Node$().dD(mask1));
      if ((mask0 < mask1)) {
        var xs = new $c_sjsr_WrappedVarArgs([key0, value0, key1, value1]);
        var array$2 = new $ac_O(xs.m());
        var iterator = $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(xs));
        var i = 0;
        while ((iterator.bc > 0)) {
          array$2.a[i] = iterator.i();
          i = ((1 + i) | 0);
        }
        return new $c_sci_BitmapIndexedMapNode(dataMap, 0, array$2, new $ac_I(new Int32Array([originalHash0, originalHash1])), 2, newCachedHash);
      } else {
        var xs$1 = new $c_sjsr_WrappedVarArgs([key1, value1, key0, value0]);
        var array$4 = new $ac_O(xs$1.m());
        var iterator$1 = $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(xs$1));
        var i$1 = 0;
        while ((iterator$1.bc > 0)) {
          array$4.a[i$1] = iterator$1.i();
          i$1 = ((1 + i$1) | 0);
        }
        return new $c_sci_BitmapIndexedMapNode(dataMap, 0, array$4, new $ac_I(new Int32Array([originalHash1, originalHash0])), 2, newCachedHash);
      }
    } else {
      var nodeMap = $m_sci_Node$().dD(mask0);
      var node = this.jg(key0, value0, originalHash0, keyHash0, key1, value1, originalHash1, keyHash1, ((5 + shift) | 0));
      var xs$2 = new $c_sjsr_WrappedVarArgs([node]);
      var array$6 = new $ac_O(xs$2.m());
      var iterator$2 = $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(xs$2));
      var i$2 = 0;
      while ((iterator$2.bc > 0)) {
        array$6.a[i$2] = iterator$2.i();
        i$2 = ((1 + i$2) | 0);
      }
      return new $c_sci_BitmapIndexedMapNode(0, nodeMap, array$6, $m_s_Array$EmptyArrays$().ia, node.aJ(), node.dE());
    }
  }
});
$p.j5 = (function() {
  return (this.ab !== 0);
});
$p.jh = (function() {
  return $m_jl_Integer$().dC(this.ab);
});
$p.gZ = (function() {
  return (this.Q !== 0);
});
$p.jm = (function() {
  return $m_jl_Integer$().dC(this.Q);
});
$p.fX = (function(bitpos) {
  return $m_jl_Integer$().dC((this.Q & ((bitpos - 1) | 0)));
});
$p.ji = (function(bitpos) {
  return $m_jl_Integer$().dC((this.ab & ((bitpos - 1) | 0)));
});
$p.oX = (function(bitpos, newKey, newValue) {
  var dataIx = this.fX(bitpos);
  var idx = (dataIx << 1);
  var src = this.af;
  var dst = new $ac_O(src.a.length);
  var length = src.a.length;
  src.t(0, dst, 0, length);
  dst.a[((1 + idx) | 0)] = newValue;
  return new $c_sci_BitmapIndexedMapNode(this.Q, this.ab, dst, this.bp, this.aL, this.bg);
});
$p.oW = (function(bitpos, oldNode, newNode) {
  var idx = ((((this.af.a.length - 1) | 0) - this.ji(bitpos)) | 0);
  var src = this.af;
  var dst = new $ac_O(src.a.length);
  var length = src.a.length;
  src.t(0, dst, 0, length);
  dst.a[idx] = newNode;
  return new $c_sci_BitmapIndexedMapNode(this.Q, this.ab, dst, this.bp, ((((this.aL - oldNode.aJ()) | 0) + newNode.aJ()) | 0), ((((this.bg - oldNode.dE()) | 0) + newNode.dE()) | 0));
});
$p.oU = (function(bitpos, key, originalHash, keyHash, value) {
  var dataIx = this.fX(bitpos);
  var idx = (dataIx << 1);
  var src = this.af;
  var dst = new $ac_O(((2 + src.a.length) | 0));
  src.t(0, dst, 0, idx);
  dst.a[idx] = key;
  dst.a[((1 + idx) | 0)] = value;
  var destPos = ((2 + idx) | 0);
  var length = ((src.a.length - idx) | 0);
  src.t(idx, dst, destPos, length);
  var dstHashes = this.pT(this.bp, dataIx, originalHash);
  return new $c_sci_BitmapIndexedMapNode((this.Q | bitpos), this.ab, dst, dstHashes, ((1 + this.aL) | 0), ((this.bg + keyHash) | 0));
});
$p.qh = (function(bitpos, keyHash, node) {
  var dataIx = this.fX(bitpos);
  var idxOld = (dataIx << 1);
  var idxNew = ((((this.af.a.length - 2) | 0) - this.ji(bitpos)) | 0);
  var src = this.af;
  var dst = new $ac_O(((src.a.length - 1) | 0));
  src.t(0, dst, 0, idxOld);
  var srcPos = ((2 + idxOld) | 0);
  var length = ((idxNew - idxOld) | 0);
  src.t(srcPos, dst, idxOld, length);
  dst.a[idxNew] = node;
  var srcPos$1 = ((2 + idxNew) | 0);
  var destPos = ((1 + idxNew) | 0);
  var length$1 = ((((src.a.length - idxNew) | 0) - 2) | 0);
  src.t(srcPos$1, dst, destPos, length$1);
  var dstHashes = this.nq(this.bp, dataIx);
  this.Q = (this.Q ^ bitpos);
  this.ab = (this.ab | bitpos);
  this.af = dst;
  this.bp = dstHashes;
  this.aL = ((((this.aL - 1) | 0) + node.aJ()) | 0);
  this.bg = ((((this.bg - keyHash) | 0) + node.dE()) | 0);
  return this;
});
$p.oV = (function(bitpos, keyHash, node) {
  var dataIx = this.fX(bitpos);
  var idxOld = (dataIx << 1);
  var idxNew = ((((this.af.a.length - 2) | 0) - this.ji(bitpos)) | 0);
  var src = this.af;
  var dst = new $ac_O(((src.a.length - 1) | 0));
  src.t(0, dst, 0, idxOld);
  var srcPos = ((2 + idxOld) | 0);
  var length = ((idxNew - idxOld) | 0);
  src.t(srcPos, dst, idxOld, length);
  dst.a[idxNew] = node;
  var srcPos$1 = ((2 + idxNew) | 0);
  var destPos = ((1 + idxNew) | 0);
  var length$1 = ((((src.a.length - idxNew) | 0) - 2) | 0);
  src.t(srcPos$1, dst, destPos, length$1);
  var dstHashes = this.nq(this.bp, dataIx);
  return new $c_sci_BitmapIndexedMapNode((this.Q ^ bitpos), (this.ab | bitpos), dst, dstHashes, ((((this.aL - 1) | 0) + node.aJ()) | 0), ((((this.bg - keyHash) | 0) + node.dE()) | 0));
});
$p.ec = (function(f) {
  var iN = $m_jl_Integer$().dC(this.Q);
  var i$1 = 0;
  while ((i$1 < iN)) {
    f.dB(this.dI(i$1), this.cU(i$1));
    i$1 = ((1 + i$1) | 0);
  }
  var jN = $m_jl_Integer$().dC(this.ab);
  var j = 0;
  while ((j < jN)) {
    this.cS(j).ec(f);
    j = ((1 + j) | 0);
  }
});
$p.l = (function(that) {
  if ((that instanceof $c_sci_BitmapIndexedMapNode)) {
    if ((this === that)) {
      return true;
    } else if ((((((this.bg === that.bg) && (this.ab === that.ab)) && (this.Q === that.Q)) && (this.aL === that.aL)) && $m_ju_Arrays$().iQ(this.bp, that.bp))) {
      var a1 = this.af;
      var a2 = that.af;
      var length = this.af.a.length;
      if ((a1 === a2)) {
        return true;
      } else {
        var isEqual = true;
        var i = 0;
        while ((isEqual && (i < length))) {
          isEqual = $m_sr_BoxesRunTime$().k(a1.a[i], a2.a[i]);
          i = ((1 + i) | 0);
        }
        return isEqual;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
});
$p.r = (function() {
  throw new $c_jl_UnsupportedOperationException("Trie nodes do not support hashing.");
});
$p.p = (function() {
  var i = $systemIdentityHashCode(this);
  return (($objectClassName(this) + "@") + (i >>> 0.0).toString(16));
});
$p.mO = (function() {
  var this$1 = this.af;
  var contentClone = this$1.e();
  var contentLength = contentClone.a.length;
  var i$1 = ($m_jl_Integer$().dC(this.Q) << 1);
  while ((i$1 < contentLength)) {
    contentClone.a[i$1] = contentClone.a[i$1].mP();
    i$1 = ((1 + i$1) | 0);
  }
  return new $c_sci_BitmapIndexedMapNode(this.Q, this.ab, contentClone, this.bp.e(), this.aL, this.bg);
});
$p.j0 = (function(index) {
  return this.cS(index);
});
$p.nK = (function(key, value, originalHash, hash, shift, replaceValue) {
  return this.nJ(key, value, originalHash, hash, shift, replaceValue);
});
$p.mP = (function() {
  return this.mO();
});
function $isArrayOf_sci_BitmapIndexedMapNode(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bN)));
}
var $d_sci_BitmapIndexedMapNode = new $TypeData().i($c_sci_BitmapIndexedMapNode, "scala.collection.immutable.BitmapIndexedMapNode", ({
  bN: 1,
  bW: 1,
  aU: 1
}));
/** @constructor */
function $c_sci_HashCollisionMapNode(originalHash, hash, content) {
  this.ig = 0;
  this.dd = 0;
  this.ac = null;
  this.ig = originalHash;
  this.dd = hash;
  this.ac = content;
  $m_s_Predef$().qG((this.ac.m() >= 2));
}
$p = $c_sci_HashCollisionMapNode.prototype = new $h_sci_MapNode();
$p.constructor = $c_sci_HashCollisionMapNode;
/** @constructor */
function $h_sci_HashCollisionMapNode() {
}
$h_sci_HashCollisionMapNode.prototype = $p;
$p.eS = (function(key) {
  var iter = this.ac.h();
  var i = 0;
  while (iter.j()) {
    if ($m_sr_BoxesRunTime$().k(iter.i().b8, key)) {
      return i;
    }
    i = ((1 + i) | 0);
  }
  return (-1);
});
$p.aJ = (function() {
  return this.ac.m();
});
$p.iD = (function(key, originalHash, hash, shift) {
  var this$1 = this.px(key, originalHash, hash, shift);
  return (this$1.c() ? $m_sc_Iterator$().P.i() : this$1.y());
});
$p.px = (function(key, originalHash, hash, shift) {
  if ((this.dd === hash)) {
    var index = this.eS(key);
    return ((index >= 0) ? new $c_s_Some(this.ac.q(index).aW) : $m_s_None$());
  } else {
    return $m_s_None$();
  }
});
$p.j1 = (function(key, originalHash, hash, shift, f) {
  if ((this.dd === hash)) {
    var x36 = this.eS(key);
    if ((x36 === (-1))) {
      return f.L();
    }
    return this.ac.q(x36).aW;
  } else {
    return f.L();
  }
});
$p.iL = (function(key, originalHash, hash, shift) {
  return ((this.dd === hash) && (this.eS(key) >= 0));
});
$p.nK = (function(key, value, originalHash, hash, shift, replaceValue) {
  var index = this.eS(key);
  return ((index >= 0) ? (replaceValue ? (Object.is(this.ac.q(index).aW, value) ? this : new $c_sci_HashCollisionMapNode(originalHash, hash, this.ac.dL(index, new $c_T2(key, value)))) : this) : new $c_sci_HashCollisionMapNode(originalHash, hash, this.ac.dA(new $c_T2(key, value))));
});
$p.j5 = (function() {
  return false;
});
$p.jh = (function() {
  return 0;
});
$p.cS = (function(index) {
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), "No sub-nodes present in hash-collision leaf node.");
});
$p.gZ = (function() {
  return true;
});
$p.jm = (function() {
  return this.ac.m();
});
$p.dI = (function(index) {
  return this.ac.q(index).b8;
});
$p.cU = (function(index) {
  return this.ac.q(index).aW;
});
$p.na = (function(index) {
  return this.ac.q(index);
});
$p.g2 = (function(index) {
  return this.ig;
});
$p.ec = (function(f) {
  this.ac.bz(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$1$2) => {
    var k = x$1$2.b8;
    var v = x$1$2.aW;
    return f.dB(k, v);
  })));
});
$p.l = (function(that) {
  if ((that instanceof $c_sci_HashCollisionMapNode)) {
    if ((this === that)) {
      return true;
    } else if (((this.dd === that.dd) && (this.ac.m() === that.ac.m()))) {
      var iter = this.ac.h();
      while (iter.j()) {
        var x47 = iter.i();
        var \u03b412$ = x47;
        var key$2 = \u03b412$.b8;
        var value$2 = \u03b412$.aW;
        var index = that.eS(key$2);
        if (((index < 0) || (!$m_sr_BoxesRunTime$().k(value$2, that.ac.q(index).aW)))) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});
$p.r = (function() {
  throw new $c_jl_UnsupportedOperationException("Trie nodes do not support hashing.");
});
$p.p = (function() {
  var i = $systemIdentityHashCode(this);
  return (($objectClassName(this) + "@") + (i >>> 0.0).toString(16));
});
$p.dE = (function() {
  return Math.imul(this.ac.m(), this.dd);
});
$p.j0 = (function(index) {
  return this.cS(index);
});
$p.mP = (function() {
  return new $c_sci_HashCollisionMapNode(this.ig, this.dd, this.ac);
});
function $isArrayOf_sci_HashCollisionMapNode(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bP)));
}
var $d_sci_HashCollisionMapNode = new $TypeData().i($c_sci_HashCollisionMapNode, "scala.collection.immutable.HashCollisionMapNode", ({
  bP: 1,
  bW: 1,
  aU: 1
}));
/** @constructor */
function $c_sci_HashMap$() {
  this.ih = null;
  $n_sci_HashMap$ = this;
  this.ih = new $c_sci_HashMap($m_sci_MapNode$().m1);
}
$p = $c_sci_HashMap$.prototype = new $h_O();
$p.constructor = $c_sci_HashMap$;
/** @constructor */
function $h_sci_HashMap$() {
}
$h_sci_HashMap$.prototype = $p;
$p.pq = (function(source) {
  return ((source instanceof $c_sci_HashMap) ? source : new $c_sci_HashMapBuilder().iC(source).jo());
});
$p.aa = (function(it) {
  return this.pq(it);
});
var $d_sci_HashMap$ = new $TypeData().i($c_sci_HashMap$, "scala.collection.immutable.HashMap$", ({
  g8: 1,
  a: 1,
  aN: 1
}));
var $n_sci_HashMap$;
function $m_sci_HashMap$() {
  if ((!$n_sci_HashMap$)) {
    $n_sci_HashMap$ = new $c_sci_HashMap$();
  }
  return $n_sci_HashMap$;
}
/** @constructor */
function $c_sci_Map$() {
}
$p = $c_sci_Map$.prototype = new $h_O();
$p.constructor = $c_sci_Map$;
/** @constructor */
function $h_sci_Map$() {
}
$h_sci_Map$.prototype = $p;
$p.ps = (function(it) {
  if ($is_sci_Iterable(it)) {
    if (it.c()) {
      return $m_sci_Map$EmptyMap$();
    }
  }
  if ((it instanceof $c_sci_HashMap)) {
    return it;
  }
  if ((it instanceof $c_sci_Map$Map1)) {
    return it;
  }
  if ((it instanceof $c_sci_Map$Map2)) {
    return it;
  }
  if ((it instanceof $c_sci_Map$Map3)) {
    return it;
  }
  if ((it instanceof $c_sci_Map$Map4)) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  if (false) {
    return it;
  }
  return new $c_sci_MapBuilderImpl().mt(it).nv();
});
$p.aa = (function(it) {
  return this.ps(it);
});
var $d_sci_Map$ = new $TypeData().i($c_sci_Map$, "scala.collection.immutable.Map$", ({
  go: 1,
  a: 1,
  aN: 1
}));
var $n_sci_Map$;
function $m_sci_Map$() {
  if ((!$n_sci_Map$)) {
    $n_sci_Map$ = new $c_sci_Map$();
  }
  return $n_sci_Map$;
}
function $f_scm_Builder__sizeHint__sc_IterableOnce__I__V($thiz, coll, delta) {
  var x1 = coll.u();
  if ((x1 === (-1))) {
    return (void 0);
  }
  var that = ((x1 + delta) | 0);
  $thiz.b6(((that < 0) ? 0 : that));
}
/** @constructor */
function $c_scm_HashSet$() {
}
$p = $c_scm_HashSet$.prototype = new $h_O();
$p.constructor = $c_scm_HashSet$;
/** @constructor */
function $h_scm_HashSet$() {
}
$h_scm_HashSet$.prototype = $p;
$p.pt = (function(it) {
  var k = it.u();
  return $ct_scm_HashSet__I__D__(new $c_scm_HashSet(), ((k > 0) ? $doubleToInt((((1 + k) | 0) / 0.75)) : 16), 0.75).mw(it);
});
$p.aH = (function() {
  return new $c_scm_HashSet$$anon$4(16, 0.75);
});
$p.aa = (function(source) {
  return this.pt(source);
});
var $d_scm_HashSet$ = new $TypeData().i($c_scm_HashSet$, "scala.collection.mutable.HashSet$", ({
  h9: 1,
  a: 1,
  G: 1
}));
var $n_scm_HashSet$;
function $m_scm_HashSet$() {
  if ((!$n_scm_HashSet$)) {
    $n_scm_HashSet$ = new $c_scm_HashSet$();
  }
  return $n_scm_HashSet$;
}
function $isArrayOf_s_math_ScalaNumber(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.hq)));
}
/** @constructor */
function $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c(f) {
  this.mg = null;
  this.mg = f;
}
$p = $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c.prototype = new $h_sr_AbstractFunction0();
$p.constructor = $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c;
/** @constructor */
function $h_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c() {
}
$h_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c.prototype = $p;
$p.L = (function() {
  return (0, this.mg)();
});
var $d_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c = new $TypeData().i($c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c, "scala.runtime.AbstractFunction0.$$Lambda$07eded5776954a9c145e92c329afd52873ad179c", ({
  hP: 1,
  cc: 1,
  aJ: 1
}));
/** @constructor */
function $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(f) {
  this.mh = null;
  this.mh = f;
}
$p = $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919.prototype = new $h_sr_AbstractFunction1();
$p.constructor = $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919;
/** @constructor */
function $h_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919() {
}
$h_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919.prototype = $p;
$p.b = (function(x0) {
  return (0, this.mh)(x0);
});
var $d_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919 = new $TypeData().i($c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919, "scala.runtime.AbstractFunction1.$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919", ({
  hQ: 1,
  cd: 1,
  h: 1
}));
/** @constructor */
function $c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8(f) {
  this.mi = null;
  this.mi = f;
}
$p = $c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8.prototype = new $h_sr_AbstractFunction2();
$p.constructor = $c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8;
/** @constructor */
function $h_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8() {
}
$h_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8.prototype = $p;
$p.dB = (function(x0, x1) {
  return (0, this.mi)(x0, x1);
});
var $d_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8 = new $TypeData().i($c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8, "scala.runtime.AbstractFunction2.$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8", ({
  hR: 1,
  ce: 1,
  aK: 1
}));
/** @constructor */
function $c_sr_AbstractPartialFunction() {
}
$p = $c_sr_AbstractPartialFunction.prototype = new $h_O();
$p.constructor = $c_sr_AbstractPartialFunction;
/** @constructor */
function $h_sr_AbstractPartialFunction() {
}
$h_sr_AbstractPartialFunction.prototype = $p;
$p.p = (function() {
  return "<function1>";
});
$p.b = (function(x) {
  return this.cQ(x, $m_s_PartialFunction$().ey);
});
var $d_sr_Nothing$ = new $TypeData().i(0, "scala.runtime.Nothing$", ({
  hY: 1,
  n: 1,
  a: 1
}));
/** @constructor */
function $c_sjs_js_Any$() {
}
$p = $c_sjs_js_Any$.prototype = new $h_O();
$p.constructor = $c_sjs_js_Any$;
/** @constructor */
function $h_sjs_js_Any$() {
}
$h_sjs_js_Any$.prototype = $p;
$p.pu = (function(f) {
  return ((arg1$2) => f.b(arg1$2));
});
var $d_sjs_js_Any$ = new $TypeData().i($c_sjs_js_Any$, "scala.scalajs.js.Any$", ({
  i5: 1,
  i6: 1,
  i7: 1
}));
var $n_sjs_js_Any$;
function $m_sjs_js_Any$() {
  if ((!$n_sjs_js_Any$)) {
    $n_sjs_js_Any$ = new $c_sjs_js_Any$();
  }
  return $n_sjs_js_Any$;
}
/** @constructor */
function $c_sjsr_AnonFunction0() {
}
$p = $c_sjsr_AnonFunction0.prototype = new $h_sr_AbstractFunction0();
$p.constructor = $c_sjsr_AnonFunction0;
/** @constructor */
function $h_sjsr_AnonFunction0() {
}
$h_sjsr_AnonFunction0.prototype = $p;
/** @constructor */
function $c_sjsr_AnonFunction1() {
}
$p = $c_sjsr_AnonFunction1.prototype = new $h_sr_AbstractFunction1();
$p.constructor = $c_sjsr_AnonFunction1;
/** @constructor */
function $h_sjsr_AnonFunction1() {
}
$h_sjsr_AnonFunction1.prototype = $p;
/** @constructor */
function $c_sjsr_AnonFunction2() {
}
$p = $c_sjsr_AnonFunction2.prototype = new $h_sr_AbstractFunction2();
$p.constructor = $c_sjsr_AnonFunction2;
/** @constructor */
function $h_sjsr_AnonFunction2() {
}
$h_sjsr_AnonFunction2.prototype = $p;
/** @constructor */
function $c_sjsr_AnonFunction3() {
}
$p = $c_sjsr_AnonFunction3.prototype = new $h_sr_AbstractFunction3();
$p.constructor = $c_sjsr_AnonFunction3;
/** @constructor */
function $h_sjsr_AnonFunction3() {
}
$h_sjsr_AnonFunction3.prototype = $p;
function $isArrayOf_s_util_control_ControlThrowable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ip)));
}
/** @constructor */
function $c_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2(parentParam$2, onTryParam$1, outer) {
  this.jG = null;
  this.hj = null;
  this.jG = onTryParam$1;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.hj = parentParam$2;
}
$p = $c_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2;
/** @constructor */
function $h_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2() {
}
$h_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2.prototype = $p;
$p.nn = (function(nextValue, transaction) {
  this.jG.dB(nextValue, transaction);
});
var $d_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2 = new $TypeData().i($c_Lcom_raquo_airstream_common_InternalParentObserver$$anon$2, "com.raquo.airstream.common.InternalParentObserver$$anon$2", ({
  cx: 1,
  aD: 1,
  cv: 1,
  b0: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_core_Observer$$anon$10(observers$2, outer) {
  this.hl = null;
  this.jJ = null;
  this.hl = observers$2;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.jJ = (void 0);
}
$p = $c_Lcom_raquo_airstream_core_Observer$$anon$10.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Observer$$anon$10;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Observer$$anon$10() {
}
$h_Lcom_raquo_airstream_core_Observer$$anon$10.prototype = $p;
$p.eg = (function() {
  return this.jJ;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.eV = (function(nextValue) {
  this.hl.bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$5) => {
    _$5.eV(nextValue);
  })));
});
$p.dK = (function(nextValue) {
  this.hl.bz(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$7) => {
    _$7.dK(nextValue);
  })));
});
var $d_Lcom_raquo_airstream_core_Observer$$anon$10 = new $TypeData().i($c_Lcom_raquo_airstream_core_Observer$$anon$10, "com.raquo.airstream.core.Observer$$anon$10", ({
  cC: 1,
  ao: 1,
  a4: 1,
  av: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_core_Observer$$anon$8(onNextParam$2, handleObserverErrors$3, onErrorParam$2, outer) {
  this.jM = null;
  this.jK = false;
  this.hm = null;
  this.jL = null;
  this.jM = onNextParam$2;
  this.jK = handleObserverErrors$3;
  this.hm = onErrorParam$2;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.jL = (void 0);
}
$p = $c_Lcom_raquo_airstream_core_Observer$$anon$8.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Observer$$anon$8;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Observer$$anon$8() {
}
$h_Lcom_raquo_airstream_core_Observer$$anon$8.prototype = $p;
$p.eg = (function() {
  return this.jL;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.eV = (function(nextValue) {
  try {
    this.jM.b(nextValue);
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if (this.jK) {
      this.h7(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError(e$2));
    } else {
      $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError(e$2));
    }
  }
});
$p.h7 = (function(error) {
  try {
    if (this.hm.c9(error)) {
      this.hm.b(error);
    } else {
      $m_Lcom_raquo_airstream_core_AirstreamError$().cc(error);
    }
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError(e$2, error));
  }
});
$p.dK = (function(nextValue) {
  nextValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((error) => {
    this.h7(error);
  })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextValue$2) => {
    this.eV(nextValue$2);
  })));
});
var $d_Lcom_raquo_airstream_core_Observer$$anon$8 = new $TypeData().i($c_Lcom_raquo_airstream_core_Observer$$anon$8, "com.raquo.airstream.core.Observer$$anon$8", ({
  cD: 1,
  ao: 1,
  a4: 1,
  av: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_core_Observer$$anon$9(onTryParam$2, handleObserverErrors$4, outer) {
  this.hn = null;
  this.jN = false;
  this.jO = null;
  this.hn = onTryParam$2;
  this.jN = handleObserverErrors$4;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.jO = (void 0);
}
$p = $c_Lcom_raquo_airstream_core_Observer$$anon$9.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_core_Observer$$anon$9;
/** @constructor */
function $h_Lcom_raquo_airstream_core_Observer$$anon$9() {
}
$h_Lcom_raquo_airstream_core_Observer$$anon$9.prototype = $p;
$p.eg = (function() {
  return this.jO;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.eV = (function(nextValue) {
  this.dK(new $c_s_util_Success(nextValue));
});
$p.h7 = (function(error) {
  this.dK(new $c_s_util_Failure(error));
});
$p.dK = (function(nextValue) {
  try {
    if (this.hn.c9(nextValue)) {
      this.hn.b(nextValue);
    } else {
      nextValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((err) => {
        $m_Lcom_raquo_airstream_core_AirstreamError$().cc(err);
      })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$3) => (void 0))));
    }
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    if ((this.jN && nextValue.nc())) {
      this.h7(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError(e$2));
    } else {
      nextValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((originalError) => {
        $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError(e$2, originalError));
      })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$4) => {
        $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError(e$2));
      })));
    }
  }
});
var $d_Lcom_raquo_airstream_core_Observer$$anon$9 = new $TypeData().i($c_Lcom_raquo_airstream_core_Observer$$anon$9, "com.raquo.airstream.core.Observer$$anon$9", ({
  cE: 1,
  ao: 1,
  a4: 1,
  av: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_api_Laminar$svg$(outer) {
  this.kg = null;
  this.kh = false;
  this.nM = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $f_Lcom_raquo_laminar_defs_complex_ComplexSvgKeys__$init$__V(this);
}
$p = $c_Lcom_raquo_laminar_api_Laminar$svg$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_api_Laminar$svg$;
/** @constructor */
function $h_Lcom_raquo_laminar_api_Laminar$svg$() {
}
$h_Lcom_raquo_laminar_api_Laminar$svg$.prototype = $p;
$p.r1 = (function() {
  if ((!this.kh)) {
    this.kg = new $c_Lcom_raquo_laminar_tags_SvgTag("svg", false);
    this.kh = true;
  }
  return this.kg;
});
var $d_Lcom_raquo_laminar_api_Laminar$svg$ = new $TypeData().i($c_Lcom_raquo_laminar_api_Laminar$svg$, "com.raquo.laminar.api.Laminar$svg$", ({
  dc: 1,
  dw: 1,
  dk: 1,
  dm: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_api_package$() {
  this.w = null;
  $n_Lcom_raquo_laminar_api_package$ = this;
  this.w = new $c_Lcom_raquo_laminar_api_package$$anon$1();
}
$p = $c_Lcom_raquo_laminar_api_package$.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_api_package$;
/** @constructor */
function $h_Lcom_raquo_laminar_api_package$() {
}
$h_Lcom_raquo_laminar_api_package$.prototype = $p;
var $d_Lcom_raquo_laminar_api_package$ = new $TypeData().i($c_Lcom_raquo_laminar_api_package$, "com.raquo.laminar.api.package$", ({
  df: 1,
  b8: 1,
  ba: 1,
  b7: 1
}));
var $n_Lcom_raquo_laminar_api_package$;
function $m_Lcom_raquo_laminar_api_package$() {
  if ((!$n_Lcom_raquo_laminar_api_package$)) {
    $n_Lcom_raquo_laminar_api_package$ = new $c_Lcom_raquo_laminar_api_package$();
  }
  return $n_Lcom_raquo_laminar_api_package$;
}
/** @constructor */
function $c_Lcom_raquo_laminar_inserters_DynamicInserter(initialContext, preferStrictMode, insertFn, hooks) {
  this.l0 = null;
  this.l2 = false;
  this.l1 = null;
  this.hH = null;
  this.l0 = initialContext;
  this.l2 = preferStrictMode;
  this.l1 = insertFn;
  this.hH = hooks;
}
$p = $c_Lcom_raquo_laminar_inserters_DynamicInserter.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_inserters_DynamicInserter;
/** @constructor */
function $h_Lcom_raquo_laminar_inserters_DynamicInserter() {
}
$h_Lcom_raquo_laminar_inserters_DynamicInserter.prototype = $p;
$p.fU = (function(element) {
  var this$1 = this.l0;
  var insertContext = (this$1.c() ? $m_Lcom_raquo_laminar_inserters_InsertContext$().qH(element, this.l2, this.hH) : this$1.y());
  var subscribe = new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((mountContext) => this.l1.gR(insertContext, mountContext.fi, this.hH)));
  return $m_Lcom_raquo_airstream_ownership_DynamicSubscription$().f0(element.bK, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((owner) => subscribe.b(new $c_Lcom_raquo_laminar_lifecycle_MountContext(element, owner)))), false);
});
$p.bV = (function(element) {
  this.fU(element);
});
var $d_Lcom_raquo_laminar_inserters_DynamicInserter = new $TypeData().i($c_Lcom_raquo_laminar_inserters_DynamicInserter, "com.raquo.laminar.inserters.DynamicInserter", ({
  dC: 1,
  W: 1,
  dG: 1,
  dD: 1
}));
function $ct_Lcom_raquo_laminar_keys_StyleProp__T__sci_Seq__($thiz, name, prefixes) {
  $thiz.hM = name;
  $thiz.hN = prefixes;
  return $thiz;
}
/** @constructor */
function $c_Lcom_raquo_laminar_keys_StyleProp() {
  this.hM = null;
  this.hN = null;
}
$p = $c_Lcom_raquo_laminar_keys_StyleProp.prototype = new $h_Lcom_raquo_laminar_keys_Key();
$p.constructor = $c_Lcom_raquo_laminar_keys_StyleProp;
/** @constructor */
function $h_Lcom_raquo_laminar_keys_StyleProp() {
}
$h_Lcom_raquo_laminar_keys_StyleProp.prototype = $p;
$p.ob = (function(values, ev) {
  return new $c_Lcom_raquo_laminar_modifiers_KeyUpdater(this, values.cd(), new $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(((el, v, _$1) => {
    $m_Lcom_raquo_laminar_DomApi$().qP(el, this, v);
  })));
});
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_CommentNode(initialText) {
  this.hV = null;
  this.hW = null;
  this.hV = $m_s_None$();
  this.hW = $m_Lcom_raquo_laminar_DomApi$().oY(initialText);
}
$p = $c_Lcom_raquo_laminar_nodes_CommentNode.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_CommentNode;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_CommentNode() {
}
$h_Lcom_raquo_laminar_nodes_CommentNode.prototype = $p;
$p.iI = (function() {
  return this.hV;
});
$p.eh = (function(maybeNextParent) {
  this.hV = maybeNextParent;
});
$p.ek = (function(maybeNextParent) {
});
$p.bV = (function(parentNode) {
  $m_Lcom_raquo_laminar_nodes_ParentNode$().fK(parentNode, this, (void 0));
});
$p.ao = (function() {
  return this.hW;
});
var $d_Lcom_raquo_laminar_nodes_CommentNode = new $TypeData().i($c_Lcom_raquo_laminar_nodes_CommentNode, "com.raquo.laminar.nodes.CommentNode", ({
  ec: 1,
  ax: 1,
  W: 1,
  aH: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_TextNode(initialText) {
  this.hZ = null;
  this.gt = null;
  this.hZ = $m_s_None$();
  this.gt = $m_Lcom_raquo_laminar_DomApi$().p1(initialText);
}
$p = $c_Lcom_raquo_laminar_nodes_TextNode.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_TextNode;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_TextNode() {
}
$h_Lcom_raquo_laminar_nodes_TextNode.prototype = $p;
$p.iI = (function() {
  return this.hZ;
});
$p.eh = (function(maybeNextParent) {
  this.hZ = maybeNextParent;
});
$p.ek = (function(maybeNextParent) {
});
$p.bV = (function(parentNode) {
  $m_Lcom_raquo_laminar_nodes_ParentNode$().fK(parentNode, this, (void 0));
});
$p.r5 = (function() {
  return this.gt.data;
});
$p.ao = (function() {
  return this.gt;
});
var $d_Lcom_raquo_laminar_nodes_TextNode = new $TypeData().i($c_Lcom_raquo_laminar_nodes_TextNode, "com.raquo.laminar.nodes.TextNode", ({
  ei: 1,
  ax: 1,
  W: 1,
  aH: 1
}));
function $isArrayOf_Ljava_io_IOException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.er)));
}
class $c_jl_AssertionError extends $c_jl_Error {
  constructor(detailMessage) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, ("" + detailMessage), ((detailMessage instanceof $c_jl_Throwable) ? detailMessage : null), true, true);
  }
}
var $d_jl_AssertionError = new $TypeData().i($c_jl_AssertionError, "java.lang.AssertionError", ({
  ev: 1,
  eB: 1,
  n: 1,
  a: 1
}));
function $f_jl_Boolean__equals__O__Z($thiz, that) {
  return ($thiz === that);
}
function $f_jl_Boolean__hashCode__I($thiz) {
  return ($thiz ? 1231 : 1237);
}
function $f_jl_Boolean__toString__T($thiz) {
  return ("" + $thiz);
}
function $isArrayOf_jl_Boolean(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bf)));
}
var $d_jl_Boolean = new $TypeData().i(0, "java.lang.Boolean", ({
  bf: 1,
  a: 1,
  a5: 1,
  a2: 1
}), ((x) => ((typeof x) === "boolean")));
function $f_jl_Character__hashCode__I($thiz) {
  return $thiz;
}
function $f_jl_Character__equals__O__Z($thiz, that) {
  return ((that instanceof $Char) && ($thiz === that.c));
}
function $f_jl_Character__toString__T($thiz) {
  return ("" + $cToS($thiz));
}
function $isArrayOf_jl_Character(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bg)));
}
var $d_jl_Character = new $TypeData().i(0, "java.lang.Character", ({
  bg: 1,
  a: 1,
  a5: 1,
  a2: 1
}), ((x) => (x instanceof $Char)));
function $isArrayOf_jl_InterruptedException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eE)));
}
function $isArrayOf_jl_LinkageError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eF)));
}
function $ct_jl_RuntimeException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
class $c_jl_RuntimeException extends $c_jl_Exception {
}
var $d_jl_RuntimeException = new $TypeData().i($c_jl_RuntimeException, "java.lang.RuntimeException", ({
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $ct_jl_StringBuilder__($thiz) {
  $thiz.n = "";
  return $thiz;
}
function $ct_jl_StringBuilder__T__($thiz, str) {
  $ct_jl_StringBuilder__($thiz);
  $thiz.n = str;
  return $thiz;
}
/** @constructor */
function $c_jl_StringBuilder() {
  this.n = null;
}
$p = $c_jl_StringBuilder.prototype = new $h_O();
$p.constructor = $c_jl_StringBuilder;
/** @constructor */
function $h_jl_StringBuilder() {
}
$h_jl_StringBuilder.prototype = $p;
$p.mA = (function(str) {
  var str$1 = $m_jl_String$().qm(str, 0, str.a.length);
  this.n = (("" + this.n) + str$1);
  return this;
});
$p.p = (function() {
  return this.n;
});
$p.m = (function() {
  return this.n.length;
});
$p.mJ = (function(index) {
  return this.n.charCodeAt(index);
});
var $d_jl_StringBuilder = new $TypeData().i($c_jl_StringBuilder, "java.lang.StringBuilder", ({
  eO: 1,
  aI: 1,
  es: 1,
  a: 1
}));
function $isArrayOf_jl_ThreadDeath(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eQ)));
}
function $isArrayOf_jl_VirtualMachineError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eT)));
}
function $isArrayOf_Ljava_math_BigDecimal(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eV)));
}
function $isArrayOf_Ljava_math_BigInteger(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eW)));
}
function $p_ju_Formatter__sendToDest__T__V($thiz, s) {
  if (($thiz.dW === null)) {
    $thiz.d2 = (("" + $thiz.d2) + s);
  } else {
    $p_ju_Formatter__sendToDestSlowPath__O__V($thiz, [s]);
  }
}
function $p_ju_Formatter__sendToDest__T__T__V($thiz, s1, s2) {
  if (($thiz.dW === null)) {
    $thiz.d2 = ((("" + $thiz.d2) + s1) + s2);
  } else {
    $p_ju_Formatter__sendToDestSlowPath__O__V($thiz, [s1, s2]);
  }
}
function $p_ju_Formatter__sendToDest__T__T__T__V($thiz, s1, s2, s3) {
  if (($thiz.dW === null)) {
    $thiz.d2 = (($thiz.d2 + (("" + s1) + s2)) + s3);
  } else {
    $p_ju_Formatter__sendToDestSlowPath__O__V($thiz, [s1, s2, s3]);
  }
}
function $p_ju_Formatter__sendToDestSlowPath__O__V($thiz, ss) {
  try {
    var len = (ss.length | 0);
    var i = 0;
    while ((i !== len)) {
      var t = ss[i];
      var this$2 = $thiz.dW;
      this$2.n = (("" + this$2.n) + t);
      i = ((1 + i) | 0);
    }
  } catch (e) {
    if ((!false)) {
      throw e;
    }
  }
}
function $p_ju_Formatter__format__ju_Formatter$LocaleInfo__T__AO__ju_Formatter($thiz, localeInfo, format, args) {
  if ($thiz.i8) {
    throw new $c_ju_FormatterClosedException();
  }
  var lastImplicitArgIndex = 0;
  var lastArgIndex = 0;
  var fmtLength = format.length;
  var fmtIndex = 0;
  while ((fmtIndex !== fmtLength)) {
    var fromIndex = fmtIndex;
    var nextPercentIndex = (format.indexOf("%", fromIndex) | 0);
    if ((nextPercentIndex < 0)) {
      var beginIndex = fmtIndex;
      $p_ju_Formatter__sendToDest__T__V($thiz, format.substring(beginIndex));
      return $thiz;
    }
    var beginIndex$1 = fmtIndex;
    $p_ju_Formatter__sendToDest__T__V($thiz, format.substring(beginIndex$1, nextPercentIndex));
    var formatSpecifierIndex = ((1 + nextPercentIndex) | 0);
    var re = $m_ju_Formatter$().lt;
    re.lastIndex = formatSpecifierIndex;
    var execResult = re.exec(format);
    if (((execResult === null) || ((execResult.index | 0) !== formatSpecifierIndex))) {
      $p_ju_Formatter__throwUnknownFormatConversionException__C__E($thiz, ((formatSpecifierIndex === fmtLength) ? 37 : format.charCodeAt(formatSpecifierIndex)));
    }
    fmtIndex = (re.lastIndex | 0);
    var index = ((fmtIndex - 1) | 0);
    var conversion$2 = format.charCodeAt(index);
    var flags = $p_ju_Formatter__parseFlags__T__C__I($thiz, execResult[2], conversion$2);
    var width = $p_ju_Formatter__parsePositiveInt__O__I($thiz, execResult[3]);
    var precision = $p_ju_Formatter__parsePositiveInt__O__I($thiz, execResult[4]);
    if ((width === (-2))) {
      $p_ju_Formatter__throwIllegalFormatWidthException__I__E($thiz, (-2147483648));
    }
    if ((precision === (-2))) {
      $p_ju_Formatter__throwIllegalFormatPrecisionException__I__E($thiz, (-2147483648));
    }
    if ((conversion$2 === 110)) {
      if ((precision !== (-1))) {
        $p_ju_Formatter__throwIllegalFormatPrecisionException__I__E($thiz, precision);
      }
      if ((width !== (-1))) {
        $p_ju_Formatter__throwIllegalFormatWidthException__I__E($thiz, width);
      }
      if ((flags !== 0)) {
        $thiz.jc(flags);
      }
      $p_ju_Formatter__sendToDest__T__V($thiz, "\n");
    } else if ((conversion$2 === 37)) {
      if ((precision !== (-1))) {
        $p_ju_Formatter__throwIllegalFormatPrecisionException__I__E($thiz, precision);
      }
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        $thiz.jc(flags);
      }
      if ((((1 & flags) !== 0) && (width === (-1)))) {
        $p_ju_Formatter__throwMissingFormatWidthException__T__E($thiz, $ps_ju_Formatter__fullFormatSpecifier$1__O__T(execResult));
      }
      if ((((-2) & flags) !== 0)) {
        $thiz.h2(37, flags, (-2));
      }
      $p_ju_Formatter__padAndSendToDestNoZeroPad__I__I__T__V($thiz, flags, width, "%");
    } else {
      var conversionLower = (((256 & flags) !== 0) ? (65535 & ((32 + conversion$2) | 0)) : conversion$2);
      var illegalFlags = $m_ju_Formatter$().ls.a[((conversionLower - 97) | 0)];
      if (((illegalFlags === (-1)) || (((256 & flags) & illegalFlags) !== 0))) {
        $p_ju_Formatter__throwUnknownFormatConversionException__C__E($thiz, conversion$2);
      }
      if ((((17 & flags) !== 0) && (width === (-1)))) {
        $p_ju_Formatter__throwMissingFormatWidthException__T__E($thiz, $ps_ju_Formatter__fullFormatSpecifier$1__O__T(execResult));
      }
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        $thiz.jc(flags);
      }
      if (((precision !== (-1)) && ((512 & illegalFlags) !== 0))) {
        $p_ju_Formatter__throwIllegalFormatPrecisionException__I__E($thiz, precision);
      }
      if (((flags & illegalFlags) !== 0)) {
        $thiz.h2(conversionLower, flags, illegalFlags);
      }
      if (((128 & flags) !== 0)) {
        var argIndex = lastArgIndex;
      } else {
        var i = $p_ju_Formatter__parsePositiveInt__O__I($thiz, execResult[1]);
        if ((i === (-1))) {
          lastImplicitArgIndex = ((1 + lastImplicitArgIndex) | 0);
          var argIndex = lastImplicitArgIndex;
        } else {
          if ((i <= 0)) {
            $p_ju_Formatter__throwIllegalFormatArgumentIndexException__I__E($thiz, i);
          }
          var argIndex = i;
        }
      }
      if (((argIndex <= 0) || (argIndex > args.a.length))) {
        $p_ju_Formatter__throwMissingFormatArgumentException__T__E($thiz, $ps_ju_Formatter__fullFormatSpecifier$1__O__T(execResult));
      }
      lastArgIndex = argIndex;
      var arg = args.a[((argIndex - 1) | 0)];
      if ((((arg === null) && (conversionLower !== 98)) && (conversionLower !== 115))) {
        $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, $m_ju_Formatter$RootLocaleInfo$(), flags, width, precision, "null");
      } else {
        $p_ju_Formatter__formatArg__ju_Formatter$LocaleInfo__O__C__I__I__I__V($thiz, localeInfo, arg, conversionLower, flags, width, precision);
      }
    }
  }
  return $thiz;
}
function $p_ju_Formatter__parseFlags__T__C__I($thiz, flags, conversion) {
  var bits = (((((conversion - 65) | 0) >>> 0) <= 25) ? 256 : 0);
  var len = flags.length;
  var i = 0;
  while ((i !== len)) {
    var index = i;
    var f = flags.charCodeAt(index);
    switch (f) {
      case 45: {
        var bit = 1;
        break;
      }
      case 35: {
        var bit = 2;
        break;
      }
      case 43: {
        var bit = 4;
        break;
      }
      case 32: {
        var bit = 8;
        break;
      }
      case 48: {
        var bit = 16;
        break;
      }
      case 44: {
        var bit = 32;
        break;
      }
      case 40: {
        var bit = 64;
        break;
      }
      case 60: {
        var bit = 128;
        break;
      }
      default: {
        var bit;
        throw new $c_jl_AssertionError($bC(f));
      }
    }
    if (((bits & bit) !== 0)) {
      $p_ju_Formatter__throwDuplicateFormatFlagsException__C__E($thiz, f);
    }
    bits = (bits | bit);
    i = ((1 + i) | 0);
  }
  return bits;
}
function $p_ju_Formatter__parsePositiveInt__O__I($thiz, capture) {
  if ((capture !== (void 0))) {
    var x = (+parseInt(capture, 10));
    return ((x <= 2.147483647E9) ? $doubleToInt(x) : (-2));
  } else {
    return (-1);
  }
}
function $p_ju_Formatter__formatArg__ju_Formatter$LocaleInfo__O__C__I__I__I__V($thiz, localeInfo, arg, conversionLower, flags, width, precision) {
  switch (conversionLower) {
    case 98: {
      $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, $m_ju_Formatter$RootLocaleInfo$(), flags, width, precision, (((arg === false) || (arg === null)) ? "false" : "true"));
      break;
    }
    case 104: {
      var $x_1 = $m_ju_Formatter$RootLocaleInfo$();
      var i = $dp_hashCode__I(arg);
      $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, $x_1, flags, width, precision, (i >>> 0.0).toString(16));
      break;
    }
    case 115: {
      if ($is_ju_Formattable(arg)) {
        var formattableFlags = (((((1 & flags) !== 0) | 0) | (((2 & flags) !== 0) ? 4 : 0)) | (((256 & flags) !== 0) ? 2 : 0));
        arg.rn($thiz, formattableFlags, width, precision);
      } else {
        if (((2 & flags) !== 0)) {
          $thiz.h2(conversionLower, flags, 2);
        }
        $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, localeInfo, flags, width, precision, ("" + arg));
      }
      break;
    }
    case 99: {
      if ((arg instanceof $Char)) {
        var $x_2 = ("" + $cToS($uC(arg)));
      } else {
        if ((!$isInt(arg))) {
          $thiz.g4(conversionLower, arg);
        }
        var x3 = (arg | 0);
        if (((x3 >>> 0) > 1114111)) {
          $p_ju_Formatter__throwIllegalFormatCodePointException__I__E($thiz, x3);
        }
        var $x_2 = $m_jl_Character$().jt(x3);
      }
      $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, localeInfo, flags, width, (-1), $x_2);
      break;
    }
    case 100: {
      if ($isInt(arg)) {
        var $x_3 = ("" + (arg | 0));
      } else if ((arg instanceof $Long)) {
        var $x_4 = $uJ(arg);
        var x3$2_$_lo = $x_4.l;
        var x3$2_$_hi = $x_4.h;
        var $x_3 = $m_RTLong$().js(x3$2_$_lo, x3$2_$_hi);
      } else {
        if ((!false)) {
          $thiz.g4(conversionLower, arg);
        }
        var $x_3 = arg.p();
      }
      $p_ju_Formatter__formatNumericString__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, localeInfo, flags, width, $x_3, "");
      break;
    }
    case 111:
    case 120: {
      var isOctal = (conversionLower === 111);
      var prefix = (((2 & flags) === 0) ? "" : (isOctal ? "0" : (((256 & flags) !== 0) ? "0X" : "0x")));
      if (false) {
        var radix = (isOctal ? 8 : 16);
        $p_ju_Formatter__formatNumericString__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, $m_ju_Formatter$RootLocaleInfo$(), flags, width, arg.jt(radix), prefix);
      } else {
        if ($isInt(arg)) {
          var x2$5 = (arg | 0);
          var str$6 = (isOctal ? (x2$5 >>> 0.0).toString(8) : (x2$5 >>> 0.0).toString(16));
        } else {
          if ((!(arg instanceof $Long))) {
            $thiz.g4(conversionLower, arg);
          }
          var $x_5 = $uJ(arg);
          var x3$3_$_lo = $x_5.l;
          var x3$3_$_hi = $x_5.h;
          var str$6 = (isOctal ? $m_jl_Long$().q0(x3$3_$_lo, x3$3_$_hi) : $m_jl_Long$().nf(x3$3_$_lo, x3$3_$_hi));
        }
        if (((76 & flags) !== 0)) {
          $thiz.h2(conversionLower, flags, 76);
        }
        $p_ju_Formatter__padAndSendToDest__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, $m_ju_Formatter$RootLocaleInfo$(), flags, width, prefix, $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, str$6));
      }
      break;
    }
    case 101:
    case 102:
    case 103: {
      if (((typeof arg) === "number")) {
        var x2$6 = (+arg);
        if (((x2$6 !== x2$6) || ((x2$6 === Infinity) || (x2$6 === (-Infinity))))) {
          $p_ju_Formatter__formatNaNOrInfinite__I__I__D__V($thiz, flags, width, x2$6);
        } else {
          $p_ju_Formatter__formatDecimal$1__ju_Formatter$Decimal__I__I__C__ju_Formatter$LocaleInfo__I__V($thiz, $m_ju_Formatter$().q2(x2$6), flags, precision, conversionLower, localeInfo, width);
        }
      } else if (false) {
        $p_ju_Formatter__formatDecimal$1__ju_Formatter$Decimal__I__I__C__ju_Formatter$LocaleInfo__I__V($thiz, $m_ju_Formatter$().q1(arg), flags, precision, conversionLower, localeInfo, width);
      } else {
        $thiz.g4(conversionLower, arg);
      }
      break;
    }
    case 97: {
      if (((typeof arg) === "number")) {
        $p_ju_Formatter__formatHexFloatingPoint__I__I__I__D__V($thiz, flags, width, precision, (+arg));
      } else {
        $thiz.g4(conversionLower, arg);
      }
      break;
    }
    default: {
      throw new $c_jl_AssertionError((("Unknown conversion '" + $cToS(conversionLower)) + "' was not rejected earlier"));
    }
  }
}
function $p_ju_Formatter__flagsToString__I__T($thiz, flags) {
  return ((((((((((1 & flags) !== 0) ? "-" : "") + (((2 & flags) !== 0) ? "#" : "")) + (((4 & flags) !== 0) ? "+" : "")) + (((8 & flags) !== 0) ? " " : "")) + (((16 & flags) !== 0) ? "0" : "")) + (((32 & flags) !== 0) ? "," : "")) + (((64 & flags) !== 0) ? "(" : "")) + (((128 & flags) !== 0) ? "<" : ""));
}
function $p_ju_Formatter__computerizedScientificNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, digitsAfterDot, forceDecimalSep) {
  var rounded = x.nx(((1 + digitsAfterDot) | 0));
  var signStr = (rounded.cw ? "-" : "");
  var intStr = rounded.cx;
  var fractionalDigitCount = ((intStr.length - 1) | 0);
  var missingZeros = ((digitsAfterDot - fractionalDigitCount) | 0);
  var integerPart = intStr.substring(0, 1);
  var fractionalPart = (("" + intStr.substring(1)) + $m_ju_Formatter$().jb(missingZeros));
  var significandStr = (((fractionalPart === "") && (!forceDecimalSep)) ? integerPart : ((integerPart + ".") + fractionalPart));
  var exponent = ((fractionalDigitCount - rounded.ch) | 0);
  var exponentSign = ((exponent < 0) ? "-" : "+");
  var sign = (exponent >> 31);
  var this$5 = (((exponent ^ sign) - sign) | 0);
  var exponentAbsStr0 = ("" + this$5);
  var exponentAbsStr = ((exponentAbsStr0.length === 1) ? ("0" + exponentAbsStr0) : exponentAbsStr0);
  return ((((signStr + significandStr) + "e") + exponentSign) + exponentAbsStr);
}
function $p_ju_Formatter__decimalNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, scale, forceDecimalSep) {
  var rounded = x.qT(scale);
  var signStr = (rounded.cw ? "-" : "");
  var intStr = rounded.cx;
  var intStrLen = intStr.length;
  var minDigits = ((1 + scale) | 0);
  var expandedIntStr = ((intStrLen >= minDigits) ? intStr : (("" + $m_ju_Formatter$().jb(((minDigits - intStrLen) | 0))) + intStr));
  var dotPos = ((expandedIntStr.length - scale) | 0);
  var integerPart = (signStr + expandedIntStr.substring(0, dotPos));
  return (((scale === 0) && (!forceDecimalSep)) ? integerPart : ((integerPart + ".") + expandedIntStr.substring(dotPos)));
}
function $p_ju_Formatter__generalScientificNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, precision, forceDecimalSep) {
  var p = ((precision === 0) ? 1 : precision);
  var rounded = x.nx(p);
  var orderOfMagnitude = ((((rounded.cx.length - 1) | 0) - rounded.ch) | 0);
  if (((orderOfMagnitude >= (-4)) && (orderOfMagnitude < p))) {
    var b = ((((p - orderOfMagnitude) | 0) - 1) | 0);
    return $p_ju_Formatter__decimalNotation__ju_Formatter$Decimal__I__Z__T($thiz, rounded, ((b < 0) ? 0 : b), forceDecimalSep);
  } else {
    return $p_ju_Formatter__computerizedScientificNotation__ju_Formatter$Decimal__I__Z__T($thiz, rounded, ((p - 1) | 0), forceDecimalSep);
  }
}
function $p_ju_Formatter__formatHexFloatingPoint__I__I__I__D__V($thiz, flags, width, precision, arg) {
  if (((arg !== arg) || ((arg === Infinity) || (arg === (-Infinity))))) {
    $p_ju_Formatter__formatNaNOrInfinite__I__I__D__V($thiz, flags, width, arg);
  } else {
    var fpBitsDataView = $fpBitsDataView;
    fpBitsDataView.setFloat64(0, arg, true);
    var lo = (fpBitsDataView.getInt32(0, true) | 0);
    var hi = (fpBitsDataView.getInt32(4, true) | 0);
    var negative = (hi < 0);
    var hi$1 = (1048575 & hi);
    var biasedExponent = (2047 & ((hi >>> 20) | 0));
    var actualPrecision = ((precision === 0) ? 1 : ((precision > 12) ? (-1) : precision));
    var signStr = (negative ? "-" : (((4 & flags) !== 0) ? "+" : (((8 & flags) !== 0) ? " " : "")));
    if ((biasedExponent === 0)) {
      if (((lo | hi$1) === 0)) {
        var x1___1 = "0";
        var x1___2 = $bL(0, 0);
        var x1___3 = 0;
      } else if ((actualPrecision === (-1))) {
        var x1___1 = "0";
        var x1___2 = $bL(lo, hi$1);
        var x1___3 = (-1022);
      } else {
        var leadingZeros = ((hi$1 !== 0) ? Math.clz32(hi$1) : ((32 + Math.clz32(lo)) | 0));
        var shift = ((leadingZeros - 11) | 0);
        var lo$2 = (((32 & shift) === 0) ? (lo << shift) : 0);
        var hi$2 = (((32 & shift) === 0) ? (((((lo >>> 1) | 0) >>> (~shift)) | 0) | (hi$1 << shift)) : (lo << shift));
        var hi$3 = (1048575 & hi$2);
        var normalizedExponent = (((-1022) - shift) | 0);
        var x1___1 = "1";
        var x1___2 = $bL(lo$2, hi$3);
        var x1___3 = normalizedExponent;
      }
    } else {
      var _3 = ((biasedExponent - 1023) | 0);
      var x1___1 = "1";
      var x1___2 = $bL(lo, hi$1);
      var x1___3 = _3;
    }
    var implicitBitStr = x1___1;
    var $x_1 = $uJ(x1___2);
    var mantissa_$_lo = $x_1.l;
    var mantissa_$_hi = $x_1.h;
    var exponent = (x1___3 | 0);
    if ((actualPrecision === (-1))) {
      var roundedMantissa_$_lo = mantissa_$_lo;
      var roundedMantissa_$_hi = mantissa_$_hi;
    } else {
      var n = ((52 - (actualPrecision << 2)) | 0);
      var lo$3 = (((32 & n) === 0) ? (1 << n) : 0);
      var hi$4 = (((32 & n) === 0) ? 0 : (1 << n));
      var lo$4 = ((lo$3 - 1) | 0);
      var hi$5 = ((((hi$4 - 1) | 0) + ((lo$4 !== (-1)) | 0)) | 0);
      var lo$5 = (((lo$3 >>> 1) | 0) | (hi$4 << 31));
      var hi$6 = (hi$4 >> 1);
      var lo$6 = (~lo$4);
      var hi$7 = (~hi$5);
      var lo$7 = (mantissa_$_lo & lo$6);
      var hi$8 = (mantissa_$_hi & hi$7);
      var lo$8 = (mantissa_$_lo & lo$4);
      var hi$9 = (mantissa_$_hi & hi$5);
      if (((hi$9 === hi$6) ? ((lo$8 >>> 0) < (lo$5 >>> 0)) : (hi$9 < hi$6))) {
        var roundedMantissa_$_lo = lo$7;
        var roundedMantissa_$_hi = hi$8;
      } else if (((hi$9 === hi$6) ? ((lo$8 >>> 0) > (lo$5 >>> 0)) : (hi$9 > hi$6))) {
        var lo$9 = ((lo$7 + lo$3) | 0);
        var hi$10 = ((((hi$8 + hi$4) | 0) + (((lo$9 >>> 0) < (lo$7 >>> 0)) | 0)) | 0);
        var roundedMantissa_$_lo = lo$9;
        var roundedMantissa_$_hi = hi$10;
      } else if ((((lo$7 & lo$3) | (hi$8 & hi$4)) === 0)) {
        var roundedMantissa_$_lo = lo$7;
        var roundedMantissa_$_hi = hi$8;
      } else {
        var lo$11 = ((lo$7 + lo$3) | 0);
        var hi$12 = ((((hi$8 + hi$4) | 0) + (((lo$11 >>> 0) < (lo$7 >>> 0)) | 0)) | 0);
        var roundedMantissa_$_lo = lo$11;
        var roundedMantissa_$_hi = hi$12;
      }
    }
    var baseStr = $m_jl_Long$().nf(roundedMantissa_$_lo, roundedMantissa_$_hi);
    var beginIndex = baseStr.length;
    var padded = (("" + "0000000000000".substring(beginIndex)) + baseStr);
    $m_ju_Formatter$();
    if ((!(padded.length === 13))) {
      throw new $c_jl_AssertionError("padded mantissa does not have the right number of bits");
    }
    var minLength = ((actualPrecision < 1) ? 1 : actualPrecision);
    var len = padded.length;
    while (((len > minLength) && (padded.charCodeAt(((len - 1) | 0)) === 48))) {
      len = ((len - 1) | 0);
    }
    var endIndex = len;
    var mantissaStr = padded.substring(0, endIndex);
    var exponentStr = ("" + exponent);
    $p_ju_Formatter__padAndSendToDest__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, $m_ju_Formatter$RootLocaleInfo$(), flags, width, (signStr + (((256 & flags) !== 0) ? "0X" : "0x")), $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, ((((implicitBitStr + ".") + mantissaStr) + "p") + exponentStr)));
  }
}
function $p_ju_Formatter__formatNonNumericString__ju_Formatter$LocaleInfo__I__I__I__T__V($thiz, localeInfo, flags, width, precision, str) {
  $p_ju_Formatter__padAndSendToDestNoZeroPad__I__I__T__V($thiz, flags, width, $p_ju_Formatter__applyUpperCase__ju_Formatter$LocaleInfo__I__T__T($thiz, localeInfo, flags, (((precision >>> 0) >= (str.length >>> 0)) ? str : str.substring(0, precision))));
}
function $p_ju_Formatter__formatNaNOrInfinite__I__I__D__V($thiz, flags, width, x) {
  $p_ju_Formatter__padAndSendToDestNoZeroPad__I__I__T__V($thiz, flags, width, $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, ((x !== x) ? "NaN" : ((x > 0.0) ? (((4 & flags) !== 0) ? "+Infinity" : (((8 & flags) !== 0) ? " Infinity" : "Infinity")) : (((64 & flags) !== 0) ? "(Infinity)" : "-Infinity")))));
}
function $p_ju_Formatter__formatNumericString__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, localeInfo, flags, width, str, basePrefix) {
  if (((str.length >= width) && ((110 & flags) === 0))) {
    $p_ju_Formatter__sendToDest__T__V($thiz, $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, str));
  } else if (((126 & flags) === 0)) {
    $p_ju_Formatter__padAndSendToDestNoZeroPad__I__I__T__V($thiz, flags, width, $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, str));
  } else {
    if ((str.charCodeAt(0) !== 45)) {
      if (((4 & flags) !== 0)) {
        var x1___1 = "+";
        var x1___2 = str;
      } else if (((8 & flags) !== 0)) {
        var x1___1 = " ";
        var x1___2 = str;
      } else {
        var x1___1 = "";
        var x1___2 = str;
      }
    } else if (((64 & flags) !== 0)) {
      var x1___1 = "(";
      var x1___2 = (str.substring(1) + ")");
    } else {
      var x1___1 = "-";
      var x1___2 = str.substring(1);
    }
    var numberPrefix = x1___1;
    var rest0 = x1___2;
    $p_ju_Formatter__padAndSendToDest__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, localeInfo, flags, width, (("" + numberPrefix) + basePrefix), $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, (((32 & flags) !== 0) ? $p_ju_Formatter__insertGroupingCommas__ju_Formatter$LocaleInfo__T__T($thiz, localeInfo, rest0) : rest0)));
  }
}
function $p_ju_Formatter__insertGroupingCommas__ju_Formatter$LocaleInfo__T__T($thiz, localeInfo, s) {
  var len = s.length;
  var index = 0;
  while (((index !== len) && ((((s.charCodeAt(index) - 48) | 0) >>> 0) <= 9))) {
    index = ((1 + index) | 0);
  }
  index = ((index - 3) | 0);
  if ((index <= 0)) {
    return s;
  } else {
    var beginIndex = index;
    var result = s.substring(beginIndex);
    while ((index > 3)) {
      var next = ((index - 3) | 0);
      var endIndex = index;
      result = ((s.substring(next, endIndex) + ",") + result);
      index = next;
    }
    var endIndex$1 = index;
    return ((s.substring(0, endIndex$1) + ",") + result);
  }
}
function $p_ju_Formatter__applyNumberUpperCase__I__T__T($thiz, flags, str) {
  return (((256 & flags) !== 0) ? str.toUpperCase() : str);
}
function $p_ju_Formatter__applyUpperCase__ju_Formatter$LocaleInfo__I__T__T($thiz, localeInfo, flags, str) {
  return (((256 & flags) !== 0) ? str.toUpperCase() : str);
}
function $p_ju_Formatter__padAndSendToDestNoZeroPad__I__I__T__V($thiz, flags, width, str) {
  var len = str.length;
  if ((len >= width)) {
    $p_ju_Formatter__sendToDest__T__V($thiz, str);
  } else if (((1 & flags) !== 0)) {
    $p_ju_Formatter__sendToDest__T__T__V($thiz, str, $p_ju_Formatter__strRepeat__T__I__T($thiz, " ", ((width - len) | 0)));
  } else {
    $p_ju_Formatter__sendToDest__T__T__V($thiz, $p_ju_Formatter__strRepeat__T__I__T($thiz, " ", ((width - len) | 0)), str);
  }
}
function $p_ju_Formatter__padAndSendToDest__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, localeInfo, flags, width, prefix, str) {
  var len = ((prefix.length + str.length) | 0);
  if ((len >= width)) {
    $p_ju_Formatter__sendToDest__T__T__V($thiz, prefix, str);
  } else if (((16 & flags) !== 0)) {
    $p_ju_Formatter__sendToDest__T__T__T__V($thiz, prefix, $p_ju_Formatter__strRepeat__T__I__T($thiz, "0", ((width - len) | 0)), str);
  } else if (((1 & flags) !== 0)) {
    $p_ju_Formatter__sendToDest__T__T__T__V($thiz, prefix, str, $p_ju_Formatter__strRepeat__T__I__T($thiz, " ", ((width - len) | 0)));
  } else {
    $p_ju_Formatter__sendToDest__T__T__T__V($thiz, $p_ju_Formatter__strRepeat__T__I__T($thiz, " ", ((width - len) | 0)), prefix, str);
  }
}
function $p_ju_Formatter__strRepeat__T__I__T($thiz, s, times) {
  var result = "";
  var i = 0;
  while ((i !== times)) {
    result = (("" + result) + s);
    i = ((1 + i) | 0);
  }
  return result;
}
function $p_ju_Formatter__throwDuplicateFormatFlagsException__C__E($thiz, flag) {
  throw new $c_ju_DuplicateFormatFlagsException(("" + $cToS(flag)));
}
function $p_ju_Formatter__throwUnknownFormatConversionException__C__E($thiz, conversion) {
  throw new $c_ju_UnknownFormatConversionException(("" + $cToS(conversion)));
}
function $p_ju_Formatter__throwIllegalFormatPrecisionException__I__E($thiz, precision) {
  throw new $c_ju_IllegalFormatPrecisionException(precision);
}
function $p_ju_Formatter__throwIllegalFormatWidthException__I__E($thiz, width) {
  throw new $c_ju_IllegalFormatWidthException(width);
}
function $p_ju_Formatter__throwIllegalFormatArgumentIndexException__I__E($thiz, index) {
  throw new $c_ju_IllegalFormatArgumentIndexException(((index === 0) ? "Illegal format argument index = 0" : "Format argument index: (not representable as int)"));
}
function $p_ju_Formatter__throwMissingFormatWidthException__T__E($thiz, fullFormatSpecifier) {
  throw new $c_ju_MissingFormatWidthException(fullFormatSpecifier);
}
function $p_ju_Formatter__throwMissingFormatArgumentException__T__E($thiz, fullFormatSpecifier) {
  throw new $c_ju_MissingFormatArgumentException(fullFormatSpecifier);
}
function $p_ju_Formatter__throwIllegalFormatCodePointException__I__E($thiz, arg) {
  throw new $c_ju_IllegalFormatCodePointException(arg);
}
function $ps_ju_Formatter__fullFormatSpecifier$1__O__T(execResult$1) {
  return ("%" + execResult$1[0]);
}
function $p_ju_Formatter__formatDecimal$1__ju_Formatter$Decimal__I__I__C__ju_Formatter$LocaleInfo__I__V($thiz, x, flags$1, precision$1, conversionLower$1, localeInfo$1, width$1) {
  var forceDecimalSep = ((2 & flags$1) !== 0);
  var actualPrecision = ((precision$1 >= 0) ? precision$1 : 6);
  switch (conversionLower$1) {
    case 101: {
      var $x_1 = $p_ju_Formatter__computerizedScientificNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, actualPrecision, forceDecimalSep);
      break;
    }
    case 102: {
      var $x_1 = $p_ju_Formatter__decimalNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, actualPrecision, forceDecimalSep);
      break;
    }
    default: {
      var $x_1 = $p_ju_Formatter__generalScientificNotation__ju_Formatter$Decimal__I__Z__T($thiz, x, actualPrecision, forceDecimalSep);
    }
  }
  $p_ju_Formatter__formatNumericString__ju_Formatter$LocaleInfo__I__I__T__T__V($thiz, localeInfo$1, flags$1, width$1, $x_1, "");
}
function $ct_ju_Formatter__jl_Appendable__ju_Formatter$LocaleInfo__($thiz, dest, formatterLocaleInfo) {
  $thiz.dW = dest;
  $thiz.lr = formatterLocaleInfo;
  $thiz.d2 = "";
  $thiz.i8 = false;
  return $thiz;
}
function $ct_ju_Formatter__($thiz) {
  $ct_ju_Formatter__jl_Appendable__ju_Formatter$LocaleInfo__($thiz, null, $m_ju_Formatter$RootLocaleInfo$());
  return $thiz;
}
/** @constructor */
function $c_ju_Formatter() {
  this.dW = null;
  this.lr = null;
  this.d2 = null;
  this.i8 = false;
}
$p = $c_ju_Formatter.prototype = new $h_O();
$p.constructor = $c_ju_Formatter;
/** @constructor */
function $h_ju_Formatter() {
}
$h_ju_Formatter.prototype = $p;
$p.pn = (function(format, args) {
  return $p_ju_Formatter__format__ju_Formatter$LocaleInfo__T__AO__ju_Formatter(this, this.lr, format, args);
});
$p.p = (function() {
  if (this.i8) {
    throw new $c_ju_FormatterClosedException();
  }
  return ((this.dW === null) ? this.d2 : this.dW.n);
});
$p.jc = (function(flags) {
  throw new $c_ju_IllegalFormatFlagsException($p_ju_Formatter__flagsToString__I__T(this, flags));
});
$p.h2 = (function(conversionLower, flags, illegalFlags) {
  throw new $c_ju_FormatFlagsConversionMismatchException($p_ju_Formatter__flagsToString__I__T(this, (flags & illegalFlags)), conversionLower);
});
$p.g4 = (function(conversionLower, arg) {
  throw new $c_ju_IllegalFormatConversionException(conversionLower, $objectGetClass(arg));
});
var $d_ju_Formatter = new $TypeData().i($c_ju_Formatter, "java.util.Formatter", ({
  f1: 1,
  ep: 1,
  ew: 1,
  eq: 1
}));
/** @constructor */
function $c_s_$eq$colon$eq() {
}
$p = $c_s_$eq$colon$eq.prototype = new $h_s_$less$colon$less();
$p.constructor = $c_s_$eq$colon$eq;
/** @constructor */
function $h_s_$eq$colon$eq() {
}
$h_s_$eq$colon$eq.prototype = $p;
/** @constructor */
function $c_s_PartialFunction$$anon$1() {
}
$p = $c_s_PartialFunction$$anon$1.prototype = new $h_O();
$p.constructor = $c_s_PartialFunction$$anon$1;
/** @constructor */
function $h_s_PartialFunction$$anon$1() {
}
$h_s_PartialFunction$$anon$1.prototype = $p;
$p.p = (function() {
  return "<function1>";
});
$p.cQ = (function(x, default$1) {
  return $f_s_PartialFunction__applyOrElse__O__F1__O(this, x, default$1);
});
$p.c9 = (function(x) {
  return false;
});
$p.iE = (function(x) {
  throw new $c_s_MatchError(x);
});
$p.b = (function(v1) {
  this.iE(v1);
});
var $d_s_PartialFunction$$anon$1 = new $TypeData().i($c_s_PartialFunction$$anon$1, "scala.PartialFunction$$anon$1", ({
  fy: 1,
  h: 1,
  j: 1,
  a: 1
}));
/** @constructor */
function $c_sc_AbstractIterator() {
}
$p = $c_sc_AbstractIterator.prototype = new $h_O();
$p.constructor = $c_sc_AbstractIterator;
/** @constructor */
function $h_sc_AbstractIterator() {
}
$h_sc_AbstractIterator.prototype = $p;
$p.u = (function() {
  return (-1);
});
$p.by = (function(dest, start, n) {
  return $f_sc_IterableOnceOps__copyToArray__O__I__I__I(this, dest, start, n);
});
$p.dz = (function(b, start, sep, end) {
  return $f_sc_IterableOnceOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end);
});
$p.ei = (function() {
  $m_sci_List$();
  return $m_sci_Nil$().eW(this);
});
$p.h = (function() {
  return this;
});
$p.iK = (function(xs) {
  return $f_sc_Iterator__concat__F0__sc_Iterator(this, xs);
});
$p.dF = (function(n) {
  return this.ga(n, (-1));
});
$p.ga = (function(from, until) {
  return $f_sc_Iterator__sliceIterator__I__I__sc_Iterator(this, from, until);
});
$p.p = (function() {
  return "<iterator>";
});
/** @constructor */
function $c_sc_Map$() {
  this.id = null;
  this.lR = null;
  this.lS = null;
  $ct_sc_MapFactory$Delegate__sc_MapFactory__(this, $m_sci_Map$());
  $n_sc_Map$ = this;
  this.lR = $ct_O__(new $c_O());
  this.lS = new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.lR));
}
$p = $c_sc_Map$.prototype = new $h_sc_MapFactory$Delegate();
$p.constructor = $c_sc_Map$;
/** @constructor */
function $h_sc_Map$() {
}
$h_sc_Map$.prototype = $p;
var $d_sc_Map$ = new $TypeData().i($c_sc_Map$, "scala.collection.Map$", ({
  fU: 1,
  fV: 1,
  a: 1,
  aN: 1
}));
var $n_sc_Map$;
function $m_sc_Map$() {
  if ((!$n_sc_Map$)) {
    $n_sc_Map$ = new $c_sc_Map$();
  }
  return $n_sc_Map$;
}
function $ct_sc_SeqFactory$Delegate__sc_SeqFactory__($thiz, delegate) {
  $thiz.dX = delegate;
  return $thiz;
}
/** @constructor */
function $c_sc_SeqFactory$Delegate() {
  this.dX = null;
}
$p = $c_sc_SeqFactory$Delegate.prototype = new $h_O();
$p.constructor = $c_sc_SeqFactory$Delegate;
/** @constructor */
function $h_sc_SeqFactory$Delegate() {
}
$h_sc_SeqFactory$Delegate.prototype = $p;
$p.mH = (function(elems) {
  return this.dX.cP(elems);
});
$p.gY = (function(it) {
  return this.dX.aa(it);
});
$p.aH = (function() {
  return this.dX.aH();
});
$p.cP = (function(elems) {
  return this.mH(elems);
});
$p.aa = (function(source) {
  return this.gY(source);
});
function $f_sc_SeqOps__distinct__O($thiz) {
  return $thiz.c7(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$2) => x$2)));
}
function $f_sc_SeqOps__distinctBy__F1__O($thiz, f) {
  return $thiz.g0(new $c_sc_View$DistinctBy($thiz, f));
}
function $f_sc_SeqOps__isDefinedAt__I__Z($thiz, idx) {
  return ((idx >= 0) && ($thiz.b2(idx) > 0));
}
function $f_sc_SeqOps__isEmpty__Z($thiz) {
  return ($thiz.b2(0) === 0);
}
function $f_sc_SeqOps__sameElements__sc_IterableOnce__Z($thiz, that) {
  var thisKnownSize = $thiz.u();
  if ((thisKnownSize !== (-1))) {
    var thatKnownSize = that.u();
    if ((thatKnownSize !== (-1))) {
      if ((thisKnownSize !== thatKnownSize)) {
        return false;
      }
      if ((thisKnownSize === 0)) {
        return true;
      }
    }
  }
  return $f_sc_Iterator__sameElements__sc_IterableOnce__Z($thiz.h(), that);
}
function $f_sc_StrictOptimizedIterableOps__map__F1__O($thiz, f) {
  var b = $thiz.b1().aH();
  var it = $thiz.h();
  while (it.j()) {
    b.aU(f.b(it.i()));
  }
  return b.aV();
}
function $f_sc_StrictOptimizedIterableOps__flatten__F1__O($thiz, toIterableOnce) {
  var b = $thiz.b1().aH();
  var it = $thiz.h();
  while (it.j()) {
    b.aT(toIterableOnce.b(it.i()));
  }
  return b.aV();
}
/** @constructor */
function $c_sci_Iterable$() {
  this.gx = null;
  $ct_sc_IterableFactory$Delegate__sc_IterableFactory__(this, $m_sci_List$());
}
$p = $c_sci_Iterable$.prototype = new $h_sc_IterableFactory$Delegate();
$p.constructor = $c_sci_Iterable$;
/** @constructor */
function $h_sci_Iterable$() {
}
$h_sci_Iterable$.prototype = $p;
$p.pr = (function(it) {
  return ($is_sci_Iterable(it) ? it : $c_sc_IterableFactory$Delegate.prototype.aa.call(this, it));
});
$p.aa = (function(it) {
  return this.pr(it);
});
var $d_sci_Iterable$ = new $TypeData().i($c_sci_Iterable$, "scala.collection.immutable.Iterable$", ({
  ge: 1,
  fL: 1,
  a: 1,
  G: 1
}));
var $n_sci_Iterable$;
function $m_sci_Iterable$() {
  if ((!$n_sci_Iterable$)) {
    $n_sci_Iterable$ = new $c_sci_Iterable$();
  }
  return $n_sci_Iterable$;
}
/** @constructor */
function $c_sci_LazyList$() {
  this.F = null;
  $n_sci_LazyList$ = this;
  this.F = $ct_sci_LazyList__O__(new $c_sci_LazyList(), $m_sci_LazyList$EmptyMarker$());
}
$p = $c_sci_LazyList$.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$;
/** @constructor */
function $h_sci_LazyList$() {
}
$h_sci_LazyList$.prototype = $p;
$p.cP = (function(elems) {
  return this.iX(elems);
});
$p.nz = (function(ll, f) {
  return $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c(((restRef) => (() => {
    var it = new $c_sr_ObjectRef(null);
    var itHasNext = false;
    var rest = new $c_sr_ObjectRef(restRef.Y);
    while (((!itHasNext) && (!($p_sci_LazyList__evaluated__sci_LazyList(rest.Y) === $m_sci_LazyList$().F)))) {
      it.Y = f.b(rest.Y.o()).h();
      itHasNext = it.Y.j();
      if ((!itHasNext)) {
        rest.Y = rest.Y.aK();
        restRef.Y = rest.Y;
      }
    }
    if (itHasNext) {
      var x$proxy2 = it.Y;
      if ((x$proxy2 === null)) {
        $m_sr_Scala3RunTime$().cr();
      }
      var head = x$proxy2.i();
      rest.Y = rest.Y.aK();
      restRef.Y = rest.Y;
      return $ct_sci_LazyList__O__sci_LazyList__(new $c_sci_LazyList(), head, $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => {
        var x$proxy3 = it.Y;
        if ((x$proxy3 === null)) {
          $m_sr_Scala3RunTime$().cr();
        }
        return this.jp(x$proxy3, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.nz(rest.Y, f))));
      }))));
    } else {
      return this.F;
    }
  }))(new $c_sr_ObjectRef(ll))));
});
$p.qM = (function(ll, n) {
  return $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c(((restRef, iRef) => (() => {
    var rest = restRef.Y;
    var i = iRef.e7;
    while (((i > 0) && (!($p_sci_LazyList__evaluated__sci_LazyList(rest) === $m_sci_LazyList$().F)))) {
      rest = rest.aK();
      restRef.Y = rest;
      i = ((i - 1) | 0);
      iRef.e7 = i;
    }
    return rest;
  }))(new $c_sr_ObjectRef(ll), new $c_sr_IntRef(n))));
});
$p.iX = (function(coll) {
  return ((coll instanceof $c_sci_LazyList) ? coll : ((coll.u() === 0) ? this.F : $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.ny(coll.h()))))));
});
$p.jp = (function(it, suffix) {
  return (it.j() ? $ct_sci_LazyList__O__sci_LazyList__(new $c_sci_LazyList(), it.i(), $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.jp(it, suffix))))) : suffix.L());
});
$p.ny = (function(it) {
  return (it.j() ? $ct_sci_LazyList__O__sci_LazyList__(new $c_sci_LazyList(), it.i(), $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.ny(it))))) : this.F);
});
$p.aH = (function() {
  return new $c_sci_LazyList$LazyBuilder();
});
$p.aa = (function(source) {
  return this.iX(source);
});
var $d_sci_LazyList$ = new $TypeData().i($c_sci_LazyList$, "scala.collection.immutable.LazyList$", ({
  gf: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_sci_LazyList$;
function $m_sci_LazyList$() {
  if ((!$n_sci_LazyList$)) {
    $n_sci_LazyList$ = new $c_sci_LazyList$();
  }
  return $n_sci_LazyList$;
}
/** @constructor */
function $c_scm_Builder$$anon$1(f$2, outer) {
  this.ma = null;
  this.fD = null;
  this.ma = f$2;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.fD = outer;
}
$p = $c_scm_Builder$$anon$1.prototype = new $h_O();
$p.constructor = $c_scm_Builder$$anon$1;
/** @constructor */
function $h_scm_Builder$$anon$1() {
}
$h_scm_Builder$$anon$1.prototype = $p;
$p.oq = (function(x) {
  this.fD.aU(x);
  return this;
});
$p.oh = (function(xs) {
  this.fD.aT(xs);
  return this;
});
$p.b6 = (function(size) {
  this.fD.b6(size);
});
$p.aV = (function() {
  return this.ma.b(this.fD.aV());
});
$p.aU = (function(elem) {
  return this.oq(elem);
});
$p.aT = (function(elems) {
  return this.oh(elems);
});
var $d_scm_Builder$$anon$1 = new $TypeData().i($c_scm_Builder$$anon$1, "scala.collection.mutable.Builder$$anon$1", ({
  h4: 1,
  H: 1,
  J: 1,
  M: 1
}));
function $ct_scm_GrowableBuilder__scm_Growable__($thiz, elems) {
  $thiz.ds = elems;
  return $thiz;
}
/** @constructor */
function $c_scm_GrowableBuilder() {
  this.ds = null;
}
$p = $c_scm_GrowableBuilder.prototype = new $h_O();
$p.constructor = $c_scm_GrowableBuilder;
/** @constructor */
function $h_scm_GrowableBuilder() {
}
$h_scm_GrowableBuilder.prototype = $p;
$p.b6 = (function(size) {
});
$p.or = (function(elem) {
  this.ds.aU(elem);
  return this;
});
$p.oi = (function(xs) {
  this.ds.aT(xs);
  return this;
});
$p.aV = (function() {
  return this.ds;
});
$p.aU = (function(elem) {
  return this.or(elem);
});
$p.aT = (function(elems) {
  return this.oi(elems);
});
var $d_scm_GrowableBuilder = new $TypeData().i($c_scm_GrowableBuilder, "scala.collection.mutable.GrowableBuilder", ({
  aX: 1,
  H: 1,
  J: 1,
  M: 1
}));
/** @constructor */
function $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d(f) {
  this.ml = null;
  this.ml = f;
}
$p = $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d.prototype = new $h_sjsr_AnonFunction0();
$p.constructor = $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d;
/** @constructor */
function $h_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d() {
}
$h_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d.prototype = $p;
$p.L = (function() {
  return (0, this.ml)();
});
var $d_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d = new $TypeData().i($c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d, "scala.scalajs.runtime.AnonFunction0.$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d", ({
  id: 1,
  ic: 1,
  cc: 1,
  aJ: 1
}));
/** @constructor */
function $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(f) {
  this.mm = null;
  this.mm = f;
}
$p = $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1.prototype = new $h_sjsr_AnonFunction1();
$p.constructor = $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1;
/** @constructor */
function $h_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1() {
}
$h_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1.prototype = $p;
$p.b = (function(x0) {
  return (0, this.mm)(x0);
});
var $d_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1 = new $TypeData().i($c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1, "scala.scalajs.runtime.AnonFunction1.$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1", ({
  ig: 1,
  ie: 1,
  cd: 1,
  h: 1
}));
/** @constructor */
function $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(f) {
  this.mn = null;
  this.mn = f;
}
$p = $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7.prototype = new $h_sjsr_AnonFunction2();
$p.constructor = $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7;
/** @constructor */
function $h_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7() {
}
$h_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7.prototype = $p;
$p.dB = (function(x0, x1) {
  return (0, this.mn)(x0, x1);
});
var $d_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7 = new $TypeData().i($c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7, "scala.scalajs.runtime.AnonFunction2.$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7", ({
  ii: 1,
  ih: 1,
  ce: 1,
  aK: 1
}));
/** @constructor */
function $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96(f) {
  this.mo = null;
  this.mo = f;
}
$p = $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96.prototype = new $h_sjsr_AnonFunction3();
$p.constructor = $c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96;
/** @constructor */
function $h_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96() {
}
$h_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96.prototype = $p;
$p.gR = (function(x0, x1, x2) {
  return (0, this.mo)(x0, x1, x2);
});
var $d_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96 = new $TypeData().i($c_sjsr_AnonFunction3_$$Lambda$73f37e31ba038fe839c174212837da323f140c96, "scala.scalajs.runtime.AnonFunction3.$$Lambda$73f37e31ba038fe839c174212837da323f140c96", ({
  ik: 1,
  ij: 1,
  hS: 1,
  fs: 1
}));
/** @constructor */
function $c_s_util_Try() {
}
$p = $c_s_util_Try.prototype = new $h_O();
$p.constructor = $c_s_util_Try;
/** @constructor */
function $h_s_util_Try() {
}
$h_s_util_Try.prototype = $p;
$p.bJ = (function() {
  return new $c_s_Product$$anon$1(this);
});
function $f_Lcom_raquo_airstream_core_WritableObservable__$init$__V($thiz) {
  $thiz.iG($m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_Observer.r().C)([]))));
  $thiz.iH($m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_airstream_core_InternalObserver.r().C)([]))));
  $thiz.gc(false);
}
function $f_Lcom_raquo_airstream_core_WritableObservable__addObserver__Lcom_raquo_airstream_core_Observer__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz, observer, owner) {
  var this$2 = $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var f = (() => {
    $f_Lcom_raquo_airstream_core_WritableObservable__maybeWillStart__V($thiz);
    var subscription = $f_Lcom_raquo_airstream_core_WritableObservable__addExternalObserver__Lcom_raquo_airstream_core_Observer__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz, observer, owner);
    observer.dK($thiz.eZ());
    $p_Lcom_raquo_airstream_core_WritableObservable__maybeStart__V($thiz);
    return subscription;
  });
  var when = (!$f_Lcom_raquo_airstream_core_BaseObservable__isStarted__Z($thiz));
  if ((this$2.b7 || (!when))) {
    var $x_1 = f();
  } else {
    this$2.b7 = true;
    try {
      var $x_1 = f();
    } finally {
      this$2.b7 = false;
      $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V(this$2);
    }
  }
  return $x_1;
}
function $f_Lcom_raquo_airstream_core_WritableObservable__addExternalObserver__Lcom_raquo_airstream_core_Observer__Lcom_raquo_airstream_ownership_Owner__Lcom_raquo_airstream_ownership_Subscription($thiz, observer, owner) {
  var subscription = new $c_Lcom_raquo_airstream_ownership_Subscription(owner, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
    $f_Lcom_raquo_airstream_core_BaseObservable__removeExternalObserver__Lcom_raquo_airstream_core_Observer__V($thiz, observer);
  })));
  var this$ = $thiz.eQ();
  this$.push(observer);
  return subscription;
}
function $f_Lcom_raquo_airstream_core_WritableObservable__addInternalObserver__Lcom_raquo_airstream_core_InternalObserver__Z__V($thiz, observer, shouldCallMaybeWillStart) {
  var this$3 = $m_Lcom_raquo_airstream_core_Transaction$onStart$();
  var f = (() => {
    if (((!$f_Lcom_raquo_airstream_core_BaseObservable__isStarted__Z($thiz)) && shouldCallMaybeWillStart)) {
      $f_Lcom_raquo_airstream_core_WritableObservable__maybeWillStart__V($thiz);
    }
    var this$ = $thiz.eT();
    this$.push(observer);
    $p_Lcom_raquo_airstream_core_WritableObservable__maybeStart__V($thiz);
  });
  var when = (!$f_Lcom_raquo_airstream_core_BaseObservable__isStarted__Z($thiz));
  if ((this$3.b7 || (!when))) {
    f();
  } else {
    this$3.b7 = true;
    try {
      f();
    } finally {
      this$3.b7 = false;
      $p_Lcom_raquo_airstream_core_Transaction$onStart$__resolve__V(this$3);
    }
  }
}
function $f_Lcom_raquo_airstream_core_WritableObservable__removeInternalObserverNow__Lcom_raquo_airstream_core_InternalObserver__V($thiz, observer) {
  if ($m_Lcom_raquo_airstream_core_ObserverList$().ns($thiz.eT(), observer)) {
    $p_Lcom_raquo_airstream_core_WritableObservable__maybeStop__V($thiz);
  }
}
function $f_Lcom_raquo_airstream_core_WritableObservable__removeExternalObserverNow__Lcom_raquo_airstream_core_Observer__V($thiz, observer) {
  if ($m_Lcom_raquo_airstream_core_ObserverList$().ns($thiz.eQ(), observer)) {
    $p_Lcom_raquo_airstream_core_WritableObservable__maybeStop__V($thiz);
  }
}
function $f_Lcom_raquo_airstream_core_WritableObservable__maybeWillStart__V($thiz) {
  if ((!$thiz.jw())) {
    $thiz.jl();
    $thiz.gc(true);
  }
}
function $p_Lcom_raquo_airstream_core_WritableObservable__maybeStart__V($thiz) {
  if (($f_Lcom_raquo_airstream_core_WritableObservable__numAllObservers__I($thiz) === 1)) {
    $thiz.jj();
  }
}
function $p_Lcom_raquo_airstream_core_WritableObservable__maybeStop__V($thiz) {
  if ((!$f_Lcom_raquo_airstream_core_BaseObservable__isStarted__Z($thiz))) {
    $thiz.jk();
    $thiz.gc(false);
  }
}
function $f_Lcom_raquo_airstream_core_WritableObservable__numAllObservers__I($thiz) {
  var this$ = $thiz.eQ();
  var $x_1 = this$.length;
  var this$$1 = $thiz.eT();
  return ((($x_1 | 0) + (this$$1.length | 0)) | 0);
}
function $f_Lcom_raquo_airstream_state_Var__$init$__V($thiz) {
  $thiz.hz = $m_Lcom_raquo_airstream_core_Observer$().pw(new $c_Lcom_raquo_airstream_state_Var$$anon$1($thiz), ($m_Lcom_raquo_airstream_core_Observer$(), true));
}
function $f_Lcom_raquo_airstream_state_Var__set__O__V($thiz, value) {
  var tryValue = new $c_s_util_Success(value);
  $thiz.hz.dK(tryValue);
}
function $f_Lcom_raquo_airstream_state_Var__update__F1__V($thiz, mod) {
  new $c_Lcom_raquo_airstream_core_Transaction(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((trx) => {
    matchResult12: {
      var x36 = $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try($thiz.cf);
      if ((x36 instanceof $c_s_util_Success)) {
        var currentValue = x36.dx;
        try {
          var $x_1 = new $c_s_util_Success(mod.b(currentValue));
        } catch (e) {
          var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
          matchResult1: {
            var $x_1;
            var x2 = $m_s_util_control_NonFatal$().gb(e$2);
            if ((!x2.c())) {
              var $x_1 = new $c_s_util_Failure(x2.y());
              break matchResult1;
            }
            throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
          }
        }
        $thiz.nC($x_1, trx);
        break matchResult12;
      }
      if ((x36 instanceof $c_s_util_Failure)) {
        var err = x36.dw;
        $m_Lcom_raquo_airstream_core_AirstreamError$().cc(new $c_Lcom_raquo_airstream_core_AirstreamError$VarError("Unable to update a failed Var. Consider Var#tryUpdate instead.", new $c_s_Some(err)));
        break matchResult12;
      }
      throw new $c_s_MatchError(x36);
    }
  })));
}
/** @constructor */
function $c_Lcom_raquo_airstream_state_Var$$anon$1(outer) {
  this.k5 = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.k5 = outer;
}
$p = $c_Lcom_raquo_airstream_state_Var$$anon$1.prototype = new $h_sr_AbstractPartialFunction();
$p.constructor = $c_Lcom_raquo_airstream_state_Var$$anon$1;
/** @constructor */
function $h_Lcom_raquo_airstream_state_Var$$anon$1() {
}
$h_Lcom_raquo_airstream_state_Var$$anon$1.prototype = $p;
$p.pY = (function(x) {
  return true;
});
$p.oA = (function(x, default$1) {
  new $c_Lcom_raquo_airstream_core_Transaction(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => {
    this.k5.nC(x, _$1);
  })));
});
$p.c9 = (function(x) {
  return this.pY(x);
});
$p.cQ = (function(x, default$1) {
  return this.oA(x, default$1);
});
var $d_Lcom_raquo_airstream_state_Var$$anon$1 = new $TypeData().i($c_Lcom_raquo_airstream_state_Var$$anon$1, "com.raquo.airstream.state.Var$$anon$1", ({
  d0: 1,
  aZ: 1,
  h: 1,
  j: 1,
  a: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_DomApi$$anon$1(outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_DomApi$$anon$1.prototype = new $h_sr_AbstractPartialFunction();
$p.constructor = $c_Lcom_raquo_laminar_DomApi$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_DomApi$$anon$1() {
}
$h_Lcom_raquo_laminar_DomApi$$anon$1.prototype = $p;
$p.c9 = (function(x) {
  return (((typeof x) === "boolean") && true);
});
$p.cQ = (function(x, default$1) {
  return (((typeof x) === "boolean") ? (!(!x)) : default$1.b(x));
});
var $d_Lcom_raquo_laminar_DomApi$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_DomApi$$anon$1, "com.raquo.laminar.DomApi$$anon$1", ({
  d6: 1,
  aZ: 1,
  h: 1,
  j: 1,
  a: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_DomApi$$anon$2(outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
}
$p = $c_Lcom_raquo_laminar_DomApi$$anon$2.prototype = new $h_sr_AbstractPartialFunction();
$p.constructor = $c_Lcom_raquo_laminar_DomApi$$anon$2;
/** @constructor */
function $h_Lcom_raquo_laminar_DomApi$$anon$2() {
}
$h_Lcom_raquo_laminar_DomApi$$anon$2.prototype = $p;
$p.c9 = (function(x) {
  return (((typeof x) === "string") || false);
});
$p.cQ = (function(x, default$1) {
  return (((typeof x) === "string") ? x : default$1.b(x));
});
var $d_Lcom_raquo_laminar_DomApi$$anon$2 = new $TypeData().i($c_Lcom_raquo_laminar_DomApi$$anon$2, "com.raquo.laminar.DomApi$$anon$2", ({
  d7: 1,
  aZ: 1,
  h: 1,
  j: 1,
  a: 1
}));
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__$init$__V($thiz) {
  $thiz.hX = new $c_Lcom_raquo_airstream_ownership_TransferableSubscription(new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
    $thiz.bK.ms();
  })), new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => {
    $thiz.bK.mQ();
  })));
  $thiz.cv = (void 0);
  $thiz.fk = $m_sci_Map$EmptyMap$();
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__addEventListener__Lcom_raquo_laminar_modifiers_EventListener__Z__V($thiz, listener, unsafePrepend) {
  if (($thiz.cv === (void 0))) {
    $thiz.cv = $m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_laminar_modifiers_EventListener.r().C)([listener])));
  } else if (unsafePrepend) {
    var x$1 = $thiz.cv;
    if ((x$1 === (void 0))) {
      var $x_1;
      throw new $c_ju_NoSuchElementException("undefined.get");
    } else {
      var $x_1 = x$1;
    }
    $x_1.unshift(listener);
  } else {
    var x$2 = $thiz.cv;
    if ((x$2 === (void 0))) {
      var $x_2;
      throw new $c_ju_NoSuchElementException("undefined.get");
    } else {
      var $x_2 = x$2;
    }
    $x_2.push(listener);
  }
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__removeEventListener__I__V($thiz, index) {
  var x = $thiz.cv;
  if ((x !== (void 0))) {
    x.splice(index, 1);
  }
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__indexOfEventListener__Lcom_raquo_laminar_modifiers_EventListener__I($thiz, listener) {
  var x = $thiz.cv;
  if ((x === (void 0))) {
    return (-1);
  } else {
    var found = false;
    var ix = 0;
    while (((!found) && (ix < (x.length | 0)))) {
      var x$1 = x[ix];
      if (((x$1 === null) ? (listener === null) : $dp_equals__O__Z(x$1, listener))) {
        found = true;
      } else {
        ix = ((1 + ix) | 0);
      }
    }
    return (found ? ix : (-1));
  }
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__updateCompositeValue__Lcom_raquo_laminar_keys_CompositeKey__Lcom_raquo_laminar_modifiers_Modifier__sci_List__sci_List__V($thiz, key, reason, addItems, removeItems) {
  var keyItemsWithReason = $thiz.fk.cT(key, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => $m_sci_Nil$())));
  var f = ((item) => {
    var these = keyItemsWithReason;
    while ((!these.c())) {
      var x0 = these.o();
      var x = x0.b8;
      if (((x === null) ? (item === null) : $dp_equals__O__Z(x, item))) {
        var x$3 = x0.aW;
        if ((!((x$3 === null) ? (reason === null) : $dp_equals__O__Z(x$3, reason)))) {
          var $x_1 = true;
        } else {
          var $x_1 = (reason === null);
        }
      } else {
        var $x_1 = false;
      }
      if ($x_1) {
        return true;
      }
      these = these.s();
    }
    return false;
  });
  var itemsToAdd = $f_sc_SeqOps__distinct__O(addItems);
  _return$1: {
    var result;
    var l$tailLocal1 = removeItems;
    while (true) {
      if (l$tailLocal1.c()) {
        var result = $m_sci_Nil$();
        break;
      } else {
        var h = l$tailLocal1.o();
        var t = l$tailLocal1.s();
        if ((!(!f(h)))) {
          l$tailLocal1 = t;
          continue;
        }
        var start = l$tailLocal1;
        var remaining$tailLocal1 = t;
        while (true) {
          if (remaining$tailLocal1.c()) {
            var result = start;
            break _return$1;
          } else {
            var x$1 = remaining$tailLocal1.o();
            if ((!(!(!f(x$1))))) {
              remaining$tailLocal1 = remaining$tailLocal1.s();
              continue;
            }
            var firstMiss = remaining$tailLocal1;
            var newHead = new $c_sci_$colon$colon(start.o(), $m_sci_Nil$());
            var toProcess = start.s();
            var currentLast = newHead;
            while ((toProcess !== firstMiss)) {
              var newElem = new $c_sci_$colon$colon(toProcess.o(), $m_sci_Nil$());
              currentLast.ap = newElem;
              currentLast = newElem;
              toProcess = toProcess.s();
            }
            var next = firstMiss.s();
            var nextToCopy = next;
            while ((!next.c())) {
              var head = next.o();
              if ((!(!(!f(head))))) {
                next = next.s();
              } else {
                while ((nextToCopy !== next)) {
                  var newElem$2 = new $c_sci_$colon$colon(nextToCopy.o(), $m_sci_Nil$());
                  currentLast.ap = newElem$2;
                  currentLast = newElem$2;
                  nextToCopy = nextToCopy.s();
                }
                nextToCopy = next.s();
                next = next.s();
              }
            }
            if ((!nextToCopy.c())) {
              currentLast.ap = nextToCopy;
            }
            var result = newHead;
            break _return$1;
          }
        }
      }
    }
  }
  var this$1 = $thiz.fk.cT(key, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => $m_sci_Nil$())));
  var f$1 = ((t$1) => result.be(t$1.b8));
  _return$3: {
    var $x_3;
    var l$tailLocal1$1 = this$1;
    while (true) {
      if (l$tailLocal1$1.c()) {
        var $x_3 = $m_sci_Nil$();
        break;
      } else {
        var h$1 = l$tailLocal1$1.o();
        var t$2 = l$tailLocal1$1.s();
        if ((!(!f$1(h$1)))) {
          l$tailLocal1$1 = t$2;
          continue;
        }
        var start$1 = l$tailLocal1$1;
        var remaining$tailLocal1$1 = t$2;
        while (true) {
          if (remaining$tailLocal1$1.c()) {
            var $x_3 = start$1;
            break _return$3;
          } else {
            var x$2 = remaining$tailLocal1$1.o();
            if ((!(!(!f$1(x$2))))) {
              remaining$tailLocal1$1 = remaining$tailLocal1$1.s();
              continue;
            }
            var firstMiss$1 = remaining$tailLocal1$1;
            var newHead$1 = new $c_sci_$colon$colon(start$1.o(), $m_sci_Nil$());
            var toProcess$1 = start$1.s();
            var currentLast$1 = newHead$1;
            while ((toProcess$1 !== firstMiss$1)) {
              var newElem$1 = new $c_sci_$colon$colon(toProcess$1.o(), $m_sci_Nil$());
              currentLast$1.ap = newElem$1;
              currentLast$1 = newElem$1;
              toProcess$1 = toProcess$1.s();
            }
            var next$1 = firstMiss$1.s();
            var nextToCopy$1 = next$1;
            while ((!next$1.c())) {
              var head$1 = next$1.o();
              if ((!(!(!f$1(head$1))))) {
                next$1 = next$1.s();
              } else {
                while ((nextToCopy$1 !== next$1)) {
                  var newElem$2$1 = new $c_sci_$colon$colon(nextToCopy$1.o(), $m_sci_Nil$());
                  currentLast$1.ap = newElem$2$1;
                  currentLast$1 = newElem$2$1;
                  nextToCopy$1 = nextToCopy$1.s();
                }
                nextToCopy$1 = next$1.s();
                next$1 = next$1.s();
              }
            }
            if ((!nextToCopy$1.c())) {
              currentLast$1.ap = nextToCopy$1;
            }
            var $x_3 = newHead$1;
            break _return$3;
          }
        }
      }
    }
  }
  var f$2 = ((_$2) => new $c_T2(_$2, reason));
  if ((itemsToAdd === $m_sci_Nil$())) {
    var $x_2 = $m_sci_Nil$();
  } else {
    var x0$1 = itemsToAdd.o();
    var h$2 = new $c_sci_$colon$colon(f$2(x0$1), $m_sci_Nil$());
    var t$3 = h$2;
    var rest = itemsToAdd.s();
    while ((rest !== $m_sci_Nil$())) {
      var x0$2 = rest.o();
      var nx = new $c_sci_$colon$colon(f$2(x0$2), $m_sci_Nil$());
      t$3.ap = nx;
      t$3 = nx;
      rest = rest.s();
    }
    var $x_2 = h$2;
  }
  var newItems = $x_3.mC($x_2);
  var domValues = key.hI.mR(key.l3.b($thiz));
  var f$3 = ((elem) => result.be(elem));
  _return$5: {
    var $x_5;
    var l$tailLocal1$2 = domValues;
    while (true) {
      if (l$tailLocal1$2.c()) {
        var $x_5 = $m_sci_Nil$();
        break;
      } else {
        var h$3 = l$tailLocal1$2.o();
        var t$4 = l$tailLocal1$2.s();
        if ((!(!f$3(h$3)))) {
          l$tailLocal1$2 = t$4;
          continue;
        }
        var start$2 = l$tailLocal1$2;
        var remaining$tailLocal1$2 = t$4;
        while (true) {
          if (remaining$tailLocal1$2.c()) {
            var $x_5 = start$2;
            break _return$5;
          } else {
            var x$4 = remaining$tailLocal1$2.o();
            if ((!(!(!f$3(x$4))))) {
              remaining$tailLocal1$2 = remaining$tailLocal1$2.s();
              continue;
            }
            var firstMiss$2 = remaining$tailLocal1$2;
            var newHead$2 = new $c_sci_$colon$colon(start$2.o(), $m_sci_Nil$());
            var toProcess$2 = start$2.s();
            var currentLast$2 = newHead$2;
            while ((toProcess$2 !== firstMiss$2)) {
              var newElem$3 = new $c_sci_$colon$colon(toProcess$2.o(), $m_sci_Nil$());
              currentLast$2.ap = newElem$3;
              currentLast$2 = newElem$3;
              toProcess$2 = toProcess$2.s();
            }
            var next$2 = firstMiss$2.s();
            var nextToCopy$2 = next$2;
            while ((!next$2.c())) {
              var head$2 = next$2.o();
              if ((!(!(!f$3(head$2))))) {
                next$2 = next$2.s();
              } else {
                while ((nextToCopy$2 !== next$2)) {
                  var newElem$2$2 = new $c_sci_$colon$colon(nextToCopy$2.o(), $m_sci_Nil$());
                  currentLast$2.ap = newElem$2$2;
                  currentLast$2 = newElem$2$2;
                  nextToCopy$2 = nextToCopy$2.s();
                }
                nextToCopy$2 = next$2.s();
                next$2 = next$2.s();
              }
            }
            if ((!nextToCopy$2.c())) {
              currentLast$2.ap = nextToCopy$2;
            }
            var $x_5 = newHead$2;
            break _return$5;
          }
        }
      }
    }
  }
  _return$7: {
    var $x_4;
    var l$tailLocal1$3 = itemsToAdd;
    while (true) {
      if (l$tailLocal1$3.c()) {
        var $x_4 = $m_sci_Nil$();
        break;
      } else {
        var h$4 = l$tailLocal1$3.o();
        var t$5 = l$tailLocal1$3.s();
        if ((!(!f(h$4)))) {
          l$tailLocal1$3 = t$5;
          continue;
        }
        var start$3 = l$tailLocal1$3;
        var remaining$tailLocal1$3 = t$5;
        while (true) {
          if (remaining$tailLocal1$3.c()) {
            var $x_4 = start$3;
            break _return$7;
          } else {
            var x$5 = remaining$tailLocal1$3.o();
            if ((!(!(!f(x$5))))) {
              remaining$tailLocal1$3 = remaining$tailLocal1$3.s();
              continue;
            }
            var firstMiss$3 = remaining$tailLocal1$3;
            var newHead$3 = new $c_sci_$colon$colon(start$3.o(), $m_sci_Nil$());
            var toProcess$3 = start$3.s();
            var currentLast$3 = newHead$3;
            while ((toProcess$3 !== firstMiss$3)) {
              var newElem$4 = new $c_sci_$colon$colon(toProcess$3.o(), $m_sci_Nil$());
              currentLast$3.ap = newElem$4;
              currentLast$3 = newElem$4;
              toProcess$3 = toProcess$3.s();
            }
            var next$3 = firstMiss$3.s();
            var nextToCopy$3 = next$3;
            while ((!next$3.c())) {
              var head$3 = next$3.o();
              if ((!(!(!f(head$3))))) {
                next$3 = next$3.s();
              } else {
                while ((nextToCopy$3 !== next$3)) {
                  var newElem$2$3 = new $c_sci_$colon$colon(nextToCopy$3.o(), $m_sci_Nil$());
                  currentLast$3.ap = newElem$2$3;
                  currentLast$3 = newElem$2$3;
                  nextToCopy$3 = nextToCopy$3.s();
                }
                nextToCopy$3 = next$3.s();
                next$3 = next$3.s();
              }
            }
            if ((!nextToCopy$3.c())) {
              currentLast$3.ap = nextToCopy$3;
            }
            var $x_4 = newHead$3;
            break _return$7;
          }
        }
      }
    }
  }
  var nextDomValues = $x_5.mC($x_4);
  $thiz.fk = $thiz.fk.dM(key, newItems);
  key.l5.dB($thiz, key.hI.mU(nextDomValues));
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__willSetParent__s_Option__V($thiz, maybeNextParent) {
  if ($p_Lcom_raquo_laminar_nodes_ReactiveElement__isUnmounting__s_Option__s_Option__Z($thiz, $thiz.fj, maybeNextParent)) {
    $p_Lcom_raquo_laminar_nodes_ReactiveElement__setPilotSubscriptionOwner__s_Option__V($thiz, maybeNextParent);
  }
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__setParent__s_Option__V($thiz, maybeNextParent) {
  var maybePrevParent = $thiz.fj;
  $thiz.fj = maybeNextParent;
  if ((!$p_Lcom_raquo_laminar_nodes_ReactiveElement__isUnmounting__s_Option__s_Option__Z($thiz, maybePrevParent, maybeNextParent))) {
    $p_Lcom_raquo_laminar_nodes_ReactiveElement__setPilotSubscriptionOwner__s_Option__V($thiz, maybeNextParent);
  }
}
function $p_Lcom_raquo_laminar_nodes_ReactiveElement__isUnmounting__s_Option__s_Option__Z($thiz, maybePrevParent, maybeNextParent) {
  var isPrevParentActive = ((!maybePrevParent.c()) && (!maybePrevParent.y().gX().bC.c()));
  var isNextParentActive = ((!maybeNextParent.c()) && (!maybeNextParent.y().gX().bC.c()));
  return (isPrevParentActive && (!isNextParentActive));
}
function $p_Lcom_raquo_laminar_nodes_ReactiveElement__setPilotSubscriptionOwner__s_Option__V($thiz, maybeNextParent) {
  $f_Lcom_raquo_laminar_nodes_ReactiveElement__unsafeSetPilotSubscriptionOwner__s_Option__V($thiz, (maybeNextParent.c() ? $m_s_None$() : new $c_s_Some(maybeNextParent.y().gX())));
}
function $f_Lcom_raquo_laminar_nodes_ReactiveElement__unsafeSetPilotSubscriptionOwner__s_Option__V($thiz, maybeNextOwner) {
  if (maybeNextOwner.c()) {
    $thiz.hX.oL();
  } else {
    var x0 = maybeNextOwner.y();
    $thiz.hX.qS(x0);
  }
}
class $c_jl_ArithmeticException extends $c_jl_RuntimeException {
  constructor(s) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, s, null, true, true);
  }
}
var $d_jl_ArithmeticException = new $TypeData().i($c_jl_ArithmeticException, "java.lang.ArithmeticException", ({
  et: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $f_jl_Byte__equals__O__Z($thiz, that) {
  return Object.is($thiz, that);
}
function $f_jl_Byte__hashCode__I($thiz) {
  return $thiz;
}
function $f_jl_Byte__toString__T($thiz) {
  return ("" + $thiz);
}
var $d_jl_Byte = new $TypeData().i(0, "java.lang.Byte", ({
  ex: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1
}), ((x) => $isByte(x)));
function $isArrayOf_jl_ClassCastException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eA)));
}
function $ct_jl_IllegalArgumentException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
function $ct_jl_IllegalArgumentException__($thiz) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, null, null, true, true);
  return $thiz;
}
class $c_jl_IllegalArgumentException extends $c_jl_RuntimeException {
}
var $d_jl_IllegalArgumentException = new $TypeData().i($c_jl_IllegalArgumentException, "java.lang.IllegalArgumentException", ({
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $ct_jl_IllegalStateException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
class $c_jl_IllegalStateException extends $c_jl_RuntimeException {
}
var $d_jl_IllegalStateException = new $TypeData().i($c_jl_IllegalStateException, "java.lang.IllegalStateException", ({
  bi: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $ct_jl_IndexOutOfBoundsException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
class $c_jl_IndexOutOfBoundsException extends $c_jl_RuntimeException {
}
var $d_jl_IndexOutOfBoundsException = new $TypeData().i($c_jl_IndexOutOfBoundsException, "java.lang.IndexOutOfBoundsException", ({
  bj: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $ct_jl_NullPointerException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
function $ct_jl_NullPointerException__($thiz) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, null, null, true, true);
  return $thiz;
}
class $c_jl_NullPointerException extends $c_jl_RuntimeException {
}
var $d_jl_NullPointerException = new $TypeData().i($c_jl_NullPointerException, "java.lang.NullPointerException", ({
  eH: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $isArrayOf_jl_SecurityException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.eJ)));
}
function $f_jl_Short__equals__O__Z($thiz, that) {
  return Object.is($thiz, that);
}
function $f_jl_Short__hashCode__I($thiz) {
  return $thiz;
}
function $f_jl_Short__toString__T($thiz) {
  return ("" + $thiz);
}
var $d_jl_Short = new $TypeData().i(0, "java.lang.Short", ({
  eK: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1
}), ((x) => $isShort(x)));
class $c_jl_UnsupportedOperationException extends $c_jl_RuntimeException {
  constructor(s) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, s, null, true, true);
  }
}
var $d_jl_UnsupportedOperationException = new $TypeData().i($c_jl_UnsupportedOperationException, "java.lang.UnsupportedOperationException", ({
  eR: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_ConcurrentModificationException extends $c_jl_RuntimeException {
  constructor(s) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, s, null, true, true);
  }
}
var $d_ju_ConcurrentModificationException = new $TypeData().i($c_ju_ConcurrentModificationException, "java.util.ConcurrentModificationException", ({
  eY: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_NoSuchElementException extends $c_jl_RuntimeException {
  constructor(s) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, s, null, true, true);
  }
}
var $d_ju_NoSuchElementException = new $TypeData().i($c_ju_NoSuchElementException, "java.util.NoSuchElementException", ({
  ff: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
/** @constructor */
function $c_s_$less$colon$less$$anon$1() {
}
$p = $c_s_$less$colon$less$$anon$1.prototype = new $h_s_$eq$colon$eq();
$p.constructor = $c_s_$less$colon$less$$anon$1;
/** @constructor */
function $h_s_$less$colon$less$$anon$1() {
}
$h_s_$less$colon$less$$anon$1.prototype = $p;
$p.b = (function(x) {
  return x;
});
$p.p = (function() {
  return "generalized constraint";
});
var $d_s_$less$colon$less$$anon$1 = new $TypeData().i($c_s_$less$colon$less$$anon$1, "scala.$less$colon$less$$anon$1", ({
  fp: 1,
  fm: 1,
  fn: 1,
  h: 1,
  a: 1
}));
function $p_s_MatchError__objString__T($thiz) {
  if ((!$thiz.lG)) {
    if (($thiz.gv === null)) {
      var $x_1 = "null";
    } else {
      var this$1 = $thiz.gv;
      var cls = $objectGetClass(this$1);
      var ofClass = ((cls === null) ? "of a JS class" : ("of class " + cls.X.N));
      try {
        var $x_1 = ((($thiz.gv + " (") + ofClass) + ")");
      } catch (e) {
        var $x_1 = ("an instance " + ofClass);
      }
    }
    $thiz.lF = $x_1;
    $thiz.lG = true;
  }
  return $thiz.lF;
}
class $c_s_MatchError extends $c_jl_RuntimeException {
  constructor(obj) {
    super();
    this.gv = null;
    this.lF = null;
    this.lG = false;
    this.gv = obj;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return $p_s_MatchError__objString__T(this);
  }
}
var $d_s_MatchError = new $TypeData().i($c_s_MatchError, "scala.MatchError", ({
  fv: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
/** @constructor */
function $c_s_Option() {
}
$p = $c_s_Option.prototype = new $h_O();
$p.constructor = $c_s_Option;
/** @constructor */
function $h_s_Option() {
}
$h_s_Option.prototype = $p;
$p.bJ = (function() {
  return new $c_s_Product$$anon$1(this);
});
$p.c = (function() {
  return (this === $m_s_None$());
});
$p.u = (function() {
  return ((!this.c()) | 0);
});
$p.be = (function(elem) {
  return ((!this.c()) && $m_sr_BoxesRunTime$().k(this.y(), elem));
});
$p.h = (function() {
  return (this.c() ? $m_sc_Iterator$().P : new $c_sc_Iterator$$anon$20(this.y()));
});
/** @constructor */
function $c_s_Product$$anon$1(outer) {
  this.fo = 0;
  this.lJ = 0;
  this.lI = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.lI = outer;
  this.fo = 0;
  this.lJ = outer.b3();
}
$p = $c_s_Product$$anon$1.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_s_Product$$anon$1;
/** @constructor */
function $h_s_Product$$anon$1() {
}
$h_s_Product$$anon$1.prototype = $p;
$p.j = (function() {
  return (this.fo < this.lJ);
});
$p.i = (function() {
  var result = this.lI.b4(this.fo);
  this.fo = ((1 + this.fo) | 0);
  return result;
});
var $d_s_Product$$anon$1 = new $TypeData().i($c_s_Product$$anon$1, "scala.Product$$anon$1", ({
  fA: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_T2(_1, _2) {
  this.b8 = null;
  this.aW = null;
  this.b8 = _1;
  this.aW = _2;
}
$p = $c_T2.prototype = new $h_O();
$p.constructor = $c_T2;
/** @constructor */
function $h_T2() {
}
$h_T2.prototype = $p;
$p.b3 = (function() {
  return 2;
});
$p.b4 = (function(n) {
  return $f_s_Product2__productElement__I__O(this, n);
});
$p.p = (function() {
  return (((("(" + this.b8) + ",") + this.aW) + ")");
});
$p.b5 = (function() {
  return "Tuple2";
});
$p.bJ = (function() {
  return new $c_sr_ScalaRunTime$$anon$1(this);
});
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().eX(this, (-116390334), true);
});
$p.l = (function(x$1) {
  return ((this === x$1) || ((x$1 instanceof $c_T2) && ($m_sr_BoxesRunTime$().k(this.b8, x$1.b8) && $m_sr_BoxesRunTime$().k(this.aW, x$1.aW))));
});
function $isArrayOf_T2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bs)));
}
var $d_T2 = new $TypeData().i($c_T2, "scala.Tuple2", ({
  bs: 1,
  fB: 1,
  F: 1,
  d: 1,
  a: 1
}));
/** @constructor */
function $c_T3(_1, _2, _3) {
  this.eA = null;
  this.eB = null;
  this.eC = null;
  this.eA = _1;
  this.eB = _2;
  this.eC = _3;
}
$p = $c_T3.prototype = new $h_O();
$p.constructor = $c_T3;
/** @constructor */
function $h_T3() {
}
$h_T3.prototype = $p;
$p.bJ = (function() {
  return new $c_s_Product$$anon$1(this);
});
$p.b3 = (function() {
  return 3;
});
$p.b4 = (function(n) {
  return $f_s_Product3__productElement__I__O(this, n);
});
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().eX(this, (-192629203), true);
});
$p.l = (function(x$0) {
  return ((this === x$0) || ((x$0 instanceof $c_T3) && (($m_sr_BoxesRunTime$().k(this.eA, x$0.eA) && $m_sr_BoxesRunTime$().k(this.eB, x$0.eB)) && $m_sr_BoxesRunTime$().k(this.eC, x$0.eC))));
});
$p.b5 = (function() {
  return "Tuple3";
});
$p.p = (function() {
  return (((((("(" + this.eA) + ",") + this.eB) + ",") + this.eC) + ")");
});
function $isArrayOf_T3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bt)));
}
var $d_T3 = new $TypeData().i($c_T3, "scala.Tuple3", ({
  bt: 1,
  d: 1,
  F: 1,
  fC: 1,
  a: 1
}));
/** @constructor */
function $c_sc_ClassTagSeqFactory$AnySeqDelegate(delegate) {
  this.fq = null;
  $ct_sc_ClassTagIterableFactory$AnyIterableDelegate__sc_ClassTagIterableFactory__(this, delegate);
}
$p = $c_sc_ClassTagSeqFactory$AnySeqDelegate.prototype = new $h_sc_ClassTagIterableFactory$AnyIterableDelegate();
$p.constructor = $c_sc_ClassTagSeqFactory$AnySeqDelegate;
/** @constructor */
function $h_sc_ClassTagSeqFactory$AnySeqDelegate() {
}
$h_sc_ClassTagSeqFactory$AnySeqDelegate.prototype = $p;
var $d_sc_ClassTagSeqFactory$AnySeqDelegate = new $TypeData().i($c_sc_ClassTagSeqFactory$AnySeqDelegate, "scala.collection.ClassTagSeqFactory$AnySeqDelegate", ({
  fI: 1,
  fH: 1,
  a: 1,
  G: 1,
  Y: 1
}));
function $f_sc_IndexedSeqOps__map__F1__O($thiz, f) {
  return $thiz.b1().aa($ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__(new $c_sc_IndexedSeqView$Map(), $thiz, f));
}
function $f_sc_IndexedSeqOps__head__O($thiz) {
  if ((!$thiz.c())) {
    return $thiz.q(0);
  } else {
    throw new $c_ju_NoSuchElementException(("head of empty " + ($is_sc_IndexedSeq($thiz) ? $thiz.bH() : $thiz.p())));
  }
}
function $f_sc_IndexedSeqOps__headOption__s_Option($thiz) {
  return ($thiz.c() ? $m_s_None$() : new $c_s_Some($thiz.o()));
}
function $f_sc_Iterable__toString__T($thiz) {
  return $f_sc_IterableOnceOps__mkString__T__T__T__T($thiz, ($thiz.bH() + "("), ", ", ")");
}
function $is_sc_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.e)));
}
function $isArrayOf_sc_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.e)));
}
/** @constructor */
function $c_sc_Iterator$$anon$19() {
}
$p = $c_sc_Iterator$$anon$19.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$$anon$19;
/** @constructor */
function $h_sc_Iterator$$anon$19() {
}
$h_sc_Iterator$$anon$19.prototype = $p;
$p.j = (function() {
  return false;
});
$p.qn = (function() {
  throw new $c_ju_NoSuchElementException("next on empty iterator");
});
$p.u = (function() {
  return 0;
});
$p.i = (function() {
  this.qn();
});
$p.ga = (function(from, until) {
  return this;
});
var $d_sc_Iterator$$anon$19 = new $TypeData().i($c_sc_Iterator$$anon$19, "scala.collection.Iterator$$anon$19", ({
  fN: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sc_Iterator$$anon$20(a$2) {
  this.lL = null;
  this.fr = false;
  this.lL = a$2;
  this.fr = false;
}
$p = $c_sc_Iterator$$anon$20.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$$anon$20;
/** @constructor */
function $h_sc_Iterator$$anon$20() {
}
$h_sc_Iterator$$anon$20.prototype = $p;
$p.j = (function() {
  return (!this.fr);
});
$p.i = (function() {
  if (this.fr) {
    return $m_sc_Iterator$().P.i();
  } else {
    this.fr = true;
    return this.lL;
  }
});
$p.ga = (function(from, until) {
  return (((this.fr || (from > 0)) || (until === 0)) ? $m_sc_Iterator$().P : this);
});
var $d_sc_Iterator$$anon$20 = new $TypeData().i($c_sc_Iterator$$anon$20, "scala.collection.Iterator$$anon$20", ({
  fO: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sc_Iterator$$anon$8(f$8, outer) {
  this.lM = null;
  this.lO = null;
  this.gy = false;
  this.lN = null;
  this.ic = null;
  this.lM = f$8;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.ic = outer;
  this.lO = $ct_scm_HashSet__(new $c_scm_HashSet());
  this.gy = false;
}
$p = $c_sc_Iterator$$anon$8.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$$anon$8;
/** @constructor */
function $h_sc_Iterator$$anon$8() {
}
$h_sc_Iterator$$anon$8.prototype = $p;
$p.j = (function() {
  while (true) {
    if (this.gy) {
      return true;
    } else if (this.ic.j()) {
      var a = this.ic.i();
      if ((!this.lO.gQ(this.lM.b(a)))) {
        continue;
      }
      this.lN = a;
      this.gy = true;
      return true;
    } else {
      return false;
    }
  }
});
$p.i = (function() {
  if (this.j()) {
    this.gy = false;
    return this.lN;
  } else {
    return $m_sc_Iterator$().P.i();
  }
});
var $d_sc_Iterator$$anon$8 = new $TypeData().i($c_sc_Iterator$$anon$8, "scala.collection.Iterator$$anon$8", ({
  fQ: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sc_Iterator$$anon$9(f$9, outer) {
  this.lP = null;
  this.gz = null;
  this.lP = f$9;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.gz = outer;
}
$p = $c_sc_Iterator$$anon$9.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$$anon$9;
/** @constructor */
function $h_sc_Iterator$$anon$9() {
}
$h_sc_Iterator$$anon$9.prototype = $p;
$p.u = (function() {
  return this.gz.u();
});
$p.j = (function() {
  return this.gz.j();
});
$p.i = (function() {
  return this.lP.b(this.gz.i());
});
var $d_sc_Iterator$$anon$9 = new $TypeData().i($c_sc_Iterator$$anon$9, "scala.collection.Iterator$$anon$9", ({
  fR: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $p_sc_Iterator$ConcatIterator__merge$1__V($thiz) {
  while (true) {
    if (($thiz.bo instanceof $c_sc_Iterator$ConcatIterator)) {
      var c = $thiz.bo;
      $thiz.bo = c.bo;
      $thiz.d3 = c.d3;
      if ((c.bN !== null)) {
        if (($thiz.bM === null)) {
          $thiz.bM = c.bM;
        }
        var x$proxy10 = c.bM;
        if ((x$proxy10 === null)) {
          $m_sr_Scala3RunTime$().cr();
        }
        x$proxy10.fs = $thiz.bN;
        $thiz.bN = c.bN;
      }
    } else {
      return (void 0);
    }
  }
}
function $p_sc_Iterator$ConcatIterator__advance$1__Z($thiz) {
  while (true) {
    if (($thiz.bN === null)) {
      $thiz.bo = null;
      $thiz.bM = null;
      return false;
    } else {
      $thiz.bo = $thiz.bN.pK();
      if (($thiz.bM === $thiz.bN)) {
        var x$proxy12 = $thiz.bM;
        if ((x$proxy12 === null)) {
          $m_sr_Scala3RunTime$().cr();
        }
        $thiz.bM = x$proxy12.fs;
      }
      $thiz.bN = $thiz.bN.fs;
      $p_sc_Iterator$ConcatIterator__merge$1__V($thiz);
      if ($thiz.d3) {
        return true;
      } else {
        if ((!(($thiz.bo !== null) && $thiz.bo.j()))) {
          continue;
        }
        $thiz.d3 = true;
        return true;
      }
    }
  }
}
/** @constructor */
function $c_sc_Iterator$ConcatIterator(from) {
  this.bo = null;
  this.bN = null;
  this.bM = null;
  this.d3 = false;
  this.bo = from;
  this.bN = null;
  this.bM = null;
  this.d3 = false;
}
$p = $c_sc_Iterator$ConcatIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$ConcatIterator;
/** @constructor */
function $h_sc_Iterator$ConcatIterator() {
}
$h_sc_Iterator$ConcatIterator.prototype = $p;
$p.j = (function() {
  if (this.d3) {
    return true;
  } else if ((this.bo !== null)) {
    if (this.bo.j()) {
      this.d3 = true;
      return true;
    } else {
      return $p_sc_Iterator$ConcatIterator__advance$1__Z(this);
    }
  } else {
    return false;
  }
});
$p.i = (function() {
  if (this.j()) {
    this.d3 = false;
    var x$proxy13 = this.bo;
    if ((x$proxy13 === null)) {
      $m_sr_Scala3RunTime$().cr();
    }
    return x$proxy13.i();
  } else {
    return $m_sc_Iterator$().P.i();
  }
});
$p.iK = (function(that) {
  var c = new $c_sc_Iterator$ConcatIteratorCell(that, null);
  if ((this.bN === null)) {
    this.bN = c;
    this.bM = c;
  } else {
    var x$proxy14 = this.bM;
    if ((x$proxy14 === null)) {
      $m_sr_Scala3RunTime$().cr();
    }
    x$proxy14.fs = c;
    this.bM = c;
  }
  if ((this.bo === null)) {
    this.bo = $m_sc_Iterator$().P;
  }
  return this;
});
function $isArrayOf_sc_Iterator$ConcatIterator(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bz)));
}
var $d_sc_Iterator$ConcatIterator = new $TypeData().i($c_sc_Iterator$ConcatIterator, "scala.collection.Iterator$ConcatIterator", ({
  bz: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $p_sc_Iterator$SliceIterator__skip__V($thiz) {
  while (($thiz.cA > 0)) {
    if ($thiz.d4.j()) {
      $thiz.d4.i();
      $thiz.cA = (($thiz.cA - 1) | 0);
    } else {
      $thiz.cA = 0;
    }
  }
}
function $p_sc_Iterator$SliceIterator__adjustedBound$1__I__I($thiz, lo$1) {
  if (($thiz.bD < 0)) {
    return (-1);
  } else {
    var that = (($thiz.bD - lo$1) | 0);
    return ((that < 0) ? 0 : that);
  }
}
/** @constructor */
function $c_sc_Iterator$SliceIterator(underlying, start, limit) {
  this.d4 = null;
  this.bD = 0;
  this.cA = 0;
  this.d4 = underlying;
  this.bD = limit;
  this.cA = start;
}
$p = $c_sc_Iterator$SliceIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_Iterator$SliceIterator;
/** @constructor */
function $h_sc_Iterator$SliceIterator() {
}
$h_sc_Iterator$SliceIterator.prototype = $p;
$p.u = (function() {
  var size = this.d4.u();
  if ((size < 0)) {
    return (-1);
  } else {
    var that = ((size - this.cA) | 0);
    var dropSize = ((that < 0) ? 0 : that);
    if ((this.bD < 0)) {
      return dropSize;
    } else {
      var x = this.bD;
      return ((x < dropSize) ? x : dropSize);
    }
  }
});
$p.j = (function() {
  $p_sc_Iterator$SliceIterator__skip__V(this);
  return ((this.bD !== 0) && this.d4.j());
});
$p.i = (function() {
  $p_sc_Iterator$SliceIterator__skip__V(this);
  if ((this.bD > 0)) {
    this.bD = ((this.bD - 1) | 0);
    return this.d4.i();
  } else {
    return ((this.bD < 0) ? this.d4.i() : $m_sc_Iterator$().P.i());
  }
});
$p.ga = (function(from, until) {
  var lo = ((from > 0) ? from : 0);
  if ((until < 0)) {
    var rest = $p_sc_Iterator$SliceIterator__adjustedBound$1__I__I(this, lo);
  } else if ((until <= lo)) {
    var rest = 0;
  } else if ((this.bD < 0)) {
    var rest = ((until - lo) | 0);
  } else {
    var x = $p_sc_Iterator$SliceIterator__adjustedBound$1__I__I(this, lo);
    var that = ((until - lo) | 0);
    var rest = ((x < that) ? x : that);
  }
  var sum = ((this.cA + lo) | 0);
  if ((rest === 0)) {
    return $m_sc_Iterator$().P;
  } else if ((sum < 0)) {
    this.cA = 2147483647;
    this.bD = 0;
    return $f_sc_Iterator__concat__F0__sc_Iterator(this, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => new $c_sc_Iterator$SliceIterator(this.d4, ((sum - 2147483647) | 0), rest))));
  } else {
    this.cA = sum;
    this.bD = rest;
    return this;
  }
});
var $d_sc_Iterator$SliceIterator = new $TypeData().i($c_sc_Iterator$SliceIterator, "scala.collection.Iterator$SliceIterator", ({
  fT: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $f_sc_LinearSeqOps__headOption__s_Option($thiz) {
  return ($thiz.c() ? $m_s_None$() : new $c_s_Some($thiz.o()));
}
function $f_sc_LinearSeqOps__length__I($thiz) {
  var these = $thiz;
  var len = 0;
  while ((!these.c())) {
    len = ((1 + len) | 0);
    these = these.s();
  }
  return len;
}
function $f_sc_LinearSeqOps__lengthCompare__I__I($thiz, len) {
  return ((len < 0) ? 1 : $p_sc_LinearSeqOps__loop$1__I__I__sc_LinearSeq__I($thiz, len, 0, $thiz));
}
function $f_sc_LinearSeqOps__isDefinedAt__I__Z($thiz, x) {
  return ((x >= 0) && ($thiz.b2(x) > 0));
}
function $f_sc_LinearSeqOps__apply__I__O($thiz, n) {
  if ((n < 0)) {
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  var skipped = $thiz.mS(n);
  if (skipped.c()) {
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  return skipped.o();
}
function $f_sc_LinearSeqOps__sameElements__sc_IterableOnce__Z($thiz, that) {
  return ($is_sc_LinearSeq(that) ? $p_sc_LinearSeqOps__linearSeqEq$1__sc_LinearSeq__sc_LinearSeq__Z($thiz, $thiz, that) : $f_sc_SeqOps__sameElements__sc_IterableOnce__Z($thiz, that));
}
function $p_sc_LinearSeqOps__loop$1__I__I__sc_LinearSeq__I($thiz, len$1, i, xs) {
  var xs$tailLocal1 = xs;
  var i$tailLocal1 = i;
  while (true) {
    if ((i$tailLocal1 === len$1)) {
      return ((!xs$tailLocal1.c()) | 0);
    } else {
      if ((!xs$tailLocal1.c())) {
        var i$tailLocal1$tmp1 = ((1 + i$tailLocal1) | 0);
        var xs$tailLocal1$tmp1 = xs$tailLocal1.s();
        i$tailLocal1 = i$tailLocal1$tmp1;
        xs$tailLocal1 = xs$tailLocal1$tmp1;
        continue;
      }
      return (-1);
    }
  }
}
function $p_sc_LinearSeqOps__linearSeqEq$1__sc_LinearSeq__sc_LinearSeq__Z($thiz, a, b) {
  var b$tailLocal1 = b;
  var a$tailLocal1 = a;
  while (true) {
    if ((a$tailLocal1 === b$tailLocal1)) {
      return true;
    } else {
      if ((((!a$tailLocal1.c()) && (!b$tailLocal1.c())) && $m_sr_BoxesRunTime$().k(a$tailLocal1.o(), b$tailLocal1.o()))) {
        var a$tailLocal1$tmp1 = a$tailLocal1.s();
        var b$tailLocal1$tmp1 = b$tailLocal1.s();
        a$tailLocal1 = a$tailLocal1$tmp1;
        b$tailLocal1 = b$tailLocal1$tmp1;
        continue;
      }
      return (a$tailLocal1.c() && b$tailLocal1.c());
    }
  }
}
/** @constructor */
function $c_sc_StrictOptimizedLinearSeqOps$$anon$1(outer) {
  this.fu = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.fu = outer;
}
$p = $c_sc_StrictOptimizedLinearSeqOps$$anon$1.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_StrictOptimizedLinearSeqOps$$anon$1;
/** @constructor */
function $h_sc_StrictOptimizedLinearSeqOps$$anon$1() {
}
$h_sc_StrictOptimizedLinearSeqOps$$anon$1.prototype = $p;
$p.j = (function() {
  return (!this.fu.c());
});
$p.i = (function() {
  var r = this.fu.o();
  this.fu = this.fu.s();
  return r;
});
var $d_sc_StrictOptimizedLinearSeqOps$$anon$1 = new $TypeData().i($c_sc_StrictOptimizedLinearSeqOps$$anon$1, "scala.collection.StrictOptimizedLinearSeqOps$$anon$1", ({
  fX: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $ct_sci_ChampBaseIterator__($thiz) {
  $thiz.bE = 0;
  $thiz.fw = 0;
  $thiz.bq = (-1);
  return $thiz;
}
function $p_sci_ChampBaseIterator__initNodes__V($thiz) {
  if (($thiz.cC === null)) {
    $thiz.cC = new $ac_I(($m_sci_Node$().fC << 1));
    $thiz.fx = new ($d_sci_Node.r().C)($m_sci_Node$().fC);
  }
}
function $ct_sci_ChampBaseIterator__sci_Node__($thiz, rootNode) {
  $ct_sci_ChampBaseIterator__($thiz);
  if (rootNode.j5()) {
    $p_sci_ChampBaseIterator__pushNode__sci_Node__V($thiz, rootNode);
  }
  if (rootNode.gZ()) {
    $p_sci_ChampBaseIterator__setupPayloadNode__sci_Node__V($thiz, rootNode);
  }
  return $thiz;
}
function $p_sci_ChampBaseIterator__setupPayloadNode__sci_Node__V($thiz, node) {
  $thiz.e1 = node;
  $thiz.bE = 0;
  $thiz.fw = node.jm();
}
function $p_sci_ChampBaseIterator__pushNode__sci_Node__V($thiz, node) {
  $p_sci_ChampBaseIterator__initNodes__V($thiz);
  $thiz.bq = ((1 + $thiz.bq) | 0);
  var cursorIndex = ($thiz.bq << 1);
  var lengthIndex = ((1 + ($thiz.bq << 1)) | 0);
  $thiz.fx.a[$thiz.bq] = node;
  $thiz.cC.a[cursorIndex] = 0;
  $thiz.cC.a[lengthIndex] = node.jh();
}
function $p_sci_ChampBaseIterator__popNode__V($thiz) {
  $thiz.bq = (($thiz.bq - 1) | 0);
}
function $p_sci_ChampBaseIterator__searchNextValueNode__Z($thiz) {
  while (($thiz.bq >= 0)) {
    var cursorIndex = ($thiz.bq << 1);
    var lengthIndex = ((1 + ($thiz.bq << 1)) | 0);
    var nodeCursor = $thiz.cC.a[cursorIndex];
    if ((nodeCursor < $thiz.cC.a[lengthIndex])) {
      var \u03b41$ = $thiz.cC;
      \u03b41$.a[cursorIndex] = ((1 + \u03b41$.a[cursorIndex]) | 0);
      var nextNode = $thiz.fx.a[$thiz.bq].j0(nodeCursor);
      if (nextNode.j5()) {
        $p_sci_ChampBaseIterator__pushNode__sci_Node__V($thiz, nextNode);
      }
      if (nextNode.gZ()) {
        $p_sci_ChampBaseIterator__setupPayloadNode__sci_Node__V($thiz, nextNode);
        return true;
      }
    } else {
      $p_sci_ChampBaseIterator__popNode__V($thiz);
    }
  }
  return false;
}
/** @constructor */
function $c_sci_ChampBaseIterator() {
  this.bE = 0;
  this.fw = 0;
  this.e1 = null;
  this.bq = 0;
  this.cC = null;
  this.fx = null;
}
$p = $c_sci_ChampBaseIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_ChampBaseIterator;
/** @constructor */
function $h_sci_ChampBaseIterator() {
}
$h_sci_ChampBaseIterator.prototype = $p;
$p.j = (function() {
  return ((this.bE < this.fw) || $p_sci_ChampBaseIterator__searchNextValueNode__Z(this));
});
function $ct_sci_ChampBaseReverseIterator__($thiz) {
  $thiz.dc = (-1);
  $thiz.bF = (-1);
  $thiz.fy = new $ac_I(((1 + $m_sci_Node$().fC) | 0));
  $thiz.fz = new ($d_sci_Node.r().C)(((1 + $m_sci_Node$().fC) | 0));
  return $thiz;
}
function $ct_sci_ChampBaseReverseIterator__sci_Node__($thiz, rootNode) {
  $ct_sci_ChampBaseReverseIterator__($thiz);
  $p_sci_ChampBaseReverseIterator__pushNode__sci_Node__V($thiz, rootNode);
  $p_sci_ChampBaseReverseIterator__searchNextValueNode__Z($thiz);
  return $thiz;
}
function $p_sci_ChampBaseReverseIterator__setupPayloadNode__sci_Node__V($thiz, node) {
  $thiz.gD = node;
  $thiz.dc = ((node.jm() - 1) | 0);
}
function $p_sci_ChampBaseReverseIterator__pushNode__sci_Node__V($thiz, node) {
  $thiz.bF = ((1 + $thiz.bF) | 0);
  $thiz.fz.a[$thiz.bF] = node;
  $thiz.fy.a[$thiz.bF] = ((node.jh() - 1) | 0);
}
function $p_sci_ChampBaseReverseIterator__popNode__V($thiz) {
  $thiz.bF = (($thiz.bF - 1) | 0);
}
function $p_sci_ChampBaseReverseIterator__searchNextValueNode__Z($thiz) {
  while (($thiz.bF >= 0)) {
    var nodeCursor = $thiz.fy.a[$thiz.bF];
    $thiz.fy.a[$thiz.bF] = ((nodeCursor - 1) | 0);
    if ((nodeCursor >= 0)) {
      $p_sci_ChampBaseReverseIterator__pushNode__sci_Node__V($thiz, $thiz.fz.a[$thiz.bF].j0(nodeCursor));
    } else {
      var currNode = $thiz.fz.a[$thiz.bF];
      $p_sci_ChampBaseReverseIterator__popNode__V($thiz);
      if (currNode.gZ()) {
        $p_sci_ChampBaseReverseIterator__setupPayloadNode__sci_Node__V($thiz, currNode);
        return true;
      }
    }
  }
  return false;
}
/** @constructor */
function $c_sci_ChampBaseReverseIterator() {
  this.dc = 0;
  this.gD = null;
  this.bF = 0;
  this.fy = null;
  this.fz = null;
}
$p = $c_sci_ChampBaseReverseIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_ChampBaseReverseIterator;
/** @constructor */
function $h_sci_ChampBaseReverseIterator() {
}
$h_sci_ChampBaseReverseIterator.prototype = $p;
$p.j = (function() {
  return ((this.dc >= 0) || $p_sci_ChampBaseReverseIterator__searchNextValueNode__Z(this));
});
function $p_sci_HashMapBuilder__isAliased__Z($thiz) {
  return ($thiz.eD !== null);
}
function $p_sci_HashMapBuilder__insertElement__AI__I__I__AI($thiz, as, ix, elem) {
  if ((ix < 0)) {
    throw $ct_jl_ArrayIndexOutOfBoundsException__(new $c_jl_ArrayIndexOutOfBoundsException());
  }
  if ((ix > as.a.length)) {
    throw $ct_jl_ArrayIndexOutOfBoundsException__(new $c_jl_ArrayIndexOutOfBoundsException());
  }
  var result = new $ac_I(((1 + as.a.length) | 0));
  as.t(0, result, 0, ix);
  result.a[ix] = elem;
  var destPos = ((1 + ix) | 0);
  var length = ((as.a.length - ix) | 0);
  as.t(ix, result, destPos, length);
  return result;
}
function $p_sci_HashMapBuilder__insertValue__sci_BitmapIndexedMapNode__I__O__I__I__O__V($thiz, bm, bitpos, key, originalHash, keyHash, value) {
  var dataIx = bm.fX(bitpos);
  var idx = (dataIx << 1);
  var src = bm.af;
  var dst = new $ac_O(((2 + src.a.length) | 0));
  src.t(0, dst, 0, idx);
  dst.a[idx] = key;
  dst.a[((1 + idx) | 0)] = value;
  var destPos = ((2 + idx) | 0);
  var length = ((src.a.length - idx) | 0);
  src.t(idx, dst, destPos, length);
  var dstHashes = $p_sci_HashMapBuilder__insertElement__AI__I__I__AI($thiz, bm.bp, dataIx, originalHash);
  bm.Q = (bm.Q | bitpos);
  bm.af = dst;
  bm.bp = dstHashes;
  bm.aL = ((1 + bm.aL) | 0);
  bm.bg = ((bm.bg + keyHash) | 0);
}
function $p_sci_HashMapBuilder__ensureUnaliased__V($thiz) {
  if ($p_sci_HashMapBuilder__isAliased__Z($thiz)) {
    $p_sci_HashMapBuilder__copyElems__V($thiz);
  }
  $thiz.eD = null;
}
function $p_sci_HashMapBuilder__copyElems__V($thiz) {
  $thiz.cj = $thiz.cj.mO();
}
/** @constructor */
function $c_sci_HashMapBuilder() {
  this.eD = null;
  this.cj = null;
  this.cj = new $c_sci_BitmapIndexedMapNode(0, 0, $m_s_Array$EmptyArrays$().lE, $m_s_Array$EmptyArrays$().ia, 0, 0);
}
$p = $c_sci_HashMapBuilder.prototype = new $h_O();
$p.constructor = $c_sci_HashMapBuilder;
/** @constructor */
function $h_sci_HashMapBuilder() {
}
$h_sci_HashMapBuilder.prototype = $p;
$p.b6 = (function(size) {
});
$p.f1 = (function(mapNode, key, value, originalHash, keyHash, shift) {
  if ((mapNode instanceof $c_sci_BitmapIndexedMapNode)) {
    var mask = $m_sci_Node$().ef(keyHash, shift);
    var bitpos = $m_sci_Node$().dD(mask);
    if (((mapNode.Q & bitpos) !== 0)) {
      var index = $m_sci_Node$().cq(mapNode.Q, mask, bitpos);
      var key0 = mapNode.dI(index);
      var key0UnimprovedHash = mapNode.g2(index);
      if (((key0UnimprovedHash === originalHash) && $m_sr_BoxesRunTime$().k(key0, key))) {
        mapNode.af.a[((1 + (index << 1)) | 0)] = value;
        return (void 0);
      } else {
        var value0 = mapNode.cU(index);
        var key0Hash = $m_sc_Hashing$().c8(key0UnimprovedHash);
        var subNodeNew = mapNode.jg(key0, value0, key0UnimprovedHash, key0Hash, key, value, originalHash, keyHash, ((5 + shift) | 0));
        mapNode.qh(bitpos, key0Hash, subNodeNew);
        return (void 0);
      }
    } else if (((mapNode.ab & bitpos) !== 0)) {
      var index$2 = $m_sci_Node$().cq(mapNode.ab, mask, bitpos);
      var subNode = mapNode.cS(index$2);
      var beforeSize = subNode.aJ();
      var beforeHash = subNode.dE();
      this.f1(subNode, key, value, originalHash, keyHash, ((5 + shift) | 0));
      mapNode.aL = ((mapNode.aL + ((subNode.aJ() - beforeSize) | 0)) | 0);
      mapNode.bg = ((mapNode.bg + ((subNode.dE() - beforeHash) | 0)) | 0);
      return (void 0);
    } else {
      $p_sci_HashMapBuilder__insertValue__sci_BitmapIndexedMapNode__I__O__I__I__O__V(this, mapNode, bitpos, key, originalHash, keyHash, value);
      return (void 0);
    }
  }
  if ((mapNode instanceof $c_sci_HashCollisionMapNode)) {
    var index$3 = mapNode.eS(key);
    if ((index$3 < 0)) {
      mapNode.ac = mapNode.ac.dA(new $c_T2(key, value));
      return (void 0);
    } else {
      mapNode.ac = mapNode.ac.dL(index$3, new $c_T2(key, value));
      return (void 0);
    }
  }
  throw new $c_s_MatchError(mapNode);
});
$p.jo = (function() {
  if ((this.cj.aL === 0)) {
    return $m_sci_HashMap$().ih;
  } else if ((this.eD !== null)) {
    return this.eD;
  } else {
    this.eD = new $c_sci_HashMap(this.cj);
    return this.eD;
  }
});
$p.mz = (function(elem) {
  $p_sci_HashMapBuilder__ensureUnaliased__V(this);
  var h = $m_sr_Statics$().H(elem.b8);
  var im = $m_sc_Hashing$().c8(h);
  this.f1(this.cj, elem.b8, elem.aW, h, im, 0);
  return this;
});
$p.e8 = (function(key, value) {
  $p_sci_HashMapBuilder__ensureUnaliased__V(this);
  var originalHash = $m_sr_Statics$().H(key);
  this.f1(this.cj, key, value, originalHash, $m_sc_Hashing$().c8(originalHash), 0);
  return this;
});
$p.iC = (function(xs) {
  $p_sci_HashMapBuilder__ensureUnaliased__V(this);
  if ((xs instanceof $c_sci_HashMap)) {
    new $c_sci_HashMapBuilder$$anon$1(xs, this);
  } else if (false) {
    var iter = xs.rq();
    while (iter.j()) {
      var next = iter.i();
      var originalHash = xs.r8(next.nb());
      var hash = $m_sc_Hashing$().c8(originalHash);
      this.f1(this.cj, next.ng(), next.rc(), originalHash, hash, 0);
    }
  } else if (false) {
    var iter$2 = xs.pb();
    while (iter$2.j()) {
      var next$2 = iter$2.i();
      var originalHash$2 = xs.r8(next$2.nb());
      var hash$2 = $m_sc_Hashing$().c8(originalHash$2);
      this.f1(this.cj, next$2.ng(), next$2.rc(), originalHash$2, hash$2, 0);
    }
  } else if ($is_sci_Map(xs)) {
    xs.ec(new $c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8(((key$2, value$2) => this.e8(key$2, value$2))));
  } else {
    var it = xs.h();
    while (it.j()) {
      this.mz(it.i());
    }
  }
  return this;
});
$p.aV = (function() {
  return this.jo();
});
$p.aU = (function(elem) {
  return this.mz(elem);
});
$p.aT = (function(elems) {
  return this.iC(elems);
});
var $d_sci_HashMapBuilder = new $TypeData().i($c_sci_HashMapBuilder, "scala.collection.immutable.HashMapBuilder", ({
  g9: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1
}));
/** @constructor */
function $c_sci_IndexedSeq$() {
  this.dX = null;
  $ct_sc_SeqFactory$Delegate__sc_SeqFactory__(this, $m_sci_Vector$());
}
$p = $c_sci_IndexedSeq$.prototype = new $h_sc_SeqFactory$Delegate();
$p.constructor = $c_sci_IndexedSeq$;
/** @constructor */
function $h_sci_IndexedSeq$() {
}
$h_sci_IndexedSeq$.prototype = $p;
$p.iW = (function(it) {
  return ($is_sci_IndexedSeq(it) ? it : $c_sc_SeqFactory$Delegate.prototype.gY.call(this, it));
});
$p.gY = (function(it) {
  return this.iW(it);
});
$p.aa = (function(source) {
  return this.iW(source);
});
var $d_sci_IndexedSeq$ = new $TypeData().i($c_sci_IndexedSeq$, "scala.collection.immutable.IndexedSeq$", ({
  gc: 1,
  aO: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_sci_IndexedSeq$;
function $m_sci_IndexedSeq$() {
  if ((!$n_sci_IndexedSeq$)) {
    $n_sci_IndexedSeq$ = new $c_sci_IndexedSeq$();
  }
  return $n_sci_IndexedSeq$;
}
/** @constructor */
function $c_sci_LazyList$LazyBuilder() {
  this.eE = null;
  this.lZ = null;
  this.oK();
}
$p = $c_sci_LazyList$LazyBuilder.prototype = new $h_O();
$p.constructor = $c_sci_LazyList$LazyBuilder;
/** @constructor */
function $h_sci_LazyList$LazyBuilder() {
}
$h_sci_LazyList$LazyBuilder.prototype = $p;
$p.b6 = (function(size) {
});
$p.oK = (function() {
  var deferred = new $c_sci_LazyList$LazyBuilder$DeferredState();
  this.lZ = ($m_sci_LazyList$(), $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => deferred.iR()))));
  this.eE = deferred;
});
$p.qK = (function() {
  this.eE.j8(new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => $m_sci_LazyList$().F)));
  return this.lZ;
});
$p.on = (function(elem) {
  var deferred = new $c_sci_LazyList$LazyBuilder$DeferredState();
  this.eE.j8(new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => {
    $m_sci_LazyList$();
    return $ct_sci_LazyList__O__sci_LazyList__(new $c_sci_LazyList(), elem, ($m_sci_LazyList$(), $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => deferred.iR())))));
  })));
  this.eE = deferred;
  return this;
});
$p.of = (function(xs) {
  if ((xs.u() !== 0)) {
    var deferred = new $c_sci_LazyList$LazyBuilder$DeferredState();
    this.eE.j8(new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => $m_sci_LazyList$().jp(xs.h(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => deferred.iR()))))));
    this.eE = deferred;
  }
  return this;
});
$p.aV = (function() {
  return this.qK();
});
$p.aU = (function(elem) {
  return this.on(elem);
});
$p.aT = (function(elems) {
  return this.of(elems);
});
var $d_sci_LazyList$LazyBuilder = new $TypeData().i($c_sci_LazyList$LazyBuilder, "scala.collection.immutable.LazyList$LazyBuilder", ({
  gh: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1
}));
/** @constructor */
function $c_sci_LazyList$LazyIterator(lazyList) {
  this.eF = null;
  this.eF = lazyList;
}
$p = $c_sci_LazyList$LazyIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_LazyList$LazyIterator;
/** @constructor */
function $h_sci_LazyList$LazyIterator() {
}
$h_sci_LazyList$LazyIterator.prototype = $p;
$p.j = (function() {
  return (!($p_sci_LazyList__evaluated__sci_LazyList(this.eF) === $m_sci_LazyList$().F));
});
$p.i = (function() {
  if (($p_sci_LazyList__evaluated__sci_LazyList(this.eF) === $m_sci_LazyList$().F)) {
    return $m_sc_Iterator$().P.i();
  } else {
    var res = this.eF.o();
    this.eF = this.eF.aK();
    return res;
  }
});
var $d_sci_LazyList$LazyIterator = new $TypeData().i($c_sci_LazyList$LazyIterator, "scala.collection.immutable.LazyList$LazyIterator", ({
  gj: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sci_List$() {
  $n_sci_List$ = this;
  var _1 = $m_sci_Nil$();
  $m_sci_Nil$();
}
$p = $c_sci_List$.prototype = new $h_O();
$p.constructor = $c_sci_List$;
/** @constructor */
function $h_sci_List$() {
}
$h_sci_List$.prototype = $p;
$p.cP = (function(elems) {
  return $m_sci_Nil$().eW(elems);
});
$p.aH = (function() {
  return new $c_scm_ListBuffer();
});
$p.aa = (function(source) {
  return $m_sci_Nil$().eW(source);
});
var $d_sci_List$ = new $TypeData().i($c_sci_List$, "scala.collection.immutable.List$", ({
  gm: 1,
  a: 1,
  G: 1,
  Y: 1,
  al: 1
}));
var $n_sci_List$;
function $m_sci_List$() {
  if ((!$n_sci_List$)) {
    $n_sci_List$ = new $c_sci_List$();
  }
  return $n_sci_List$;
}
function $ct_sci_Map$Map2$Map2Iterator__sci_Map$Map2__($thiz, outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $thiz.eG = outer;
  $thiz.dg = 0;
  return $thiz;
}
/** @constructor */
function $c_sci_Map$Map2$Map2Iterator() {
  this.dg = 0;
  this.eG = null;
}
$p = $c_sci_Map$Map2$Map2Iterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_Map$Map2$Map2Iterator;
/** @constructor */
function $h_sci_Map$Map2$Map2Iterator() {
}
$h_sci_Map$Map2$Map2Iterator.prototype = $p;
$p.j = (function() {
  return (this.dg < 2);
});
$p.i = (function() {
  matchResult5$1: {
    var result;
    var x23 = this.dg;
    if ((x23 === 0)) {
      var result = new $c_T2(this.eG.c0, this.eG.de);
      break matchResult5$1;
    }
    if ((x23 === 1)) {
      var result = new $c_T2(this.eG.c1, this.eG.df);
      break matchResult5$1;
    }
    var result = $m_sc_Iterator$().P.i();
  }
  this.dg = ((1 + this.dg) | 0);
  return result;
});
$p.dF = (function(n) {
  this.dg = ((this.dg + n) | 0);
  return this;
});
function $ct_sci_Map$Map3$Map3Iterator__sci_Map$Map3__($thiz, outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $thiz.dh = outer;
  $thiz.di = 0;
  return $thiz;
}
/** @constructor */
function $c_sci_Map$Map3$Map3Iterator() {
  this.di = 0;
  this.dh = null;
}
$p = $c_sci_Map$Map3$Map3Iterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_Map$Map3$Map3Iterator;
/** @constructor */
function $h_sci_Map$Map3$Map3Iterator() {
}
$h_sci_Map$Map3$Map3Iterator.prototype = $p;
$p.j = (function() {
  return (this.di < 3);
});
$p.i = (function() {
  var result;
  switch (this.di) {
    case 0: {
      var result = new $c_T2(this.dh.bO, this.dh.cD);
      break;
    }
    case 1: {
      var result = new $c_T2(this.dh.bP, this.dh.cE);
      break;
    }
    case 2: {
      var result = new $c_T2(this.dh.bQ, this.dh.cF);
      break;
    }
    default: {
      var result = $m_sc_Iterator$().P.i();
    }
  }
  this.di = ((1 + this.di) | 0);
  return result;
});
$p.dF = (function(n) {
  this.di = ((this.di + n) | 0);
  return this;
});
function $ct_sci_Map$Map4$Map4Iterator__sci_Map$Map4__($thiz, outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $thiz.cm = outer;
  $thiz.dj = 0;
  return $thiz;
}
/** @constructor */
function $c_sci_Map$Map4$Map4Iterator() {
  this.dj = 0;
  this.cm = null;
}
$p = $c_sci_Map$Map4$Map4Iterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_Map$Map4$Map4Iterator;
/** @constructor */
function $h_sci_Map$Map4$Map4Iterator() {
}
$h_sci_Map$Map4$Map4Iterator.prototype = $p;
$p.j = (function() {
  return (this.dj < 4);
});
$p.i = (function() {
  var result;
  switch (this.dj) {
    case 0: {
      var result = new $c_T2(this.cm.br, this.cm.c2);
      break;
    }
    case 1: {
      var result = new $c_T2(this.cm.bs, this.cm.c3);
      break;
    }
    case 2: {
      var result = new $c_T2(this.cm.bt, this.cm.c4);
      break;
    }
    case 3: {
      var result = new $c_T2(this.cm.bu, this.cm.c5);
      break;
    }
    default: {
      var result = $m_sc_Iterator$().P.i();
    }
  }
  this.dj = ((1 + this.dj) | 0);
  return result;
});
$p.dF = (function(n) {
  this.dj = ((this.dj + n) | 0);
  return this;
});
/** @constructor */
function $c_sci_MapBuilderImpl() {
  this.cG = null;
  this.fA = false;
  this.e3 = null;
  this.cG = $m_sci_Map$EmptyMap$();
  this.fA = false;
}
$p = $c_sci_MapBuilderImpl.prototype = new $h_O();
$p.constructor = $c_sci_MapBuilderImpl;
/** @constructor */
function $h_sci_MapBuilderImpl() {
}
$h_sci_MapBuilderImpl.prototype = $p;
$p.b6 = (function(size) {
});
$p.nv = (function() {
  return (this.fA ? this.e3.jo() : this.cG);
});
$p.ol = (function(key, value) {
  if (this.fA) {
    this.e3.e8(key, value);
  } else if ((this.cG.aJ() < 4)) {
    this.cG = this.cG.dM(key, value);
  } else if (this.cG.be(key)) {
    this.cG = this.cG.dM(key, value);
  } else {
    this.fA = true;
    if ((this.e3 === null)) {
      this.e3 = new $c_sci_HashMapBuilder();
    }
    this.cG.oH(this.e3);
    this.e3.e8(key, value);
  }
  return this;
});
$p.mt = (function(xs) {
  return (this.fA ? (this.e3.iC(xs), this) : $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, xs));
});
$p.aV = (function() {
  return this.nv();
});
$p.aU = (function(elem) {
  return this.ol(elem.b8, elem.aW);
});
$p.aT = (function(elems) {
  return this.mt(elems);
});
var $d_sci_MapBuilderImpl = new $TypeData().i($c_sci_MapBuilderImpl, "scala.collection.immutable.MapBuilderImpl", ({
  gw: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1
}));
/** @constructor */
function $c_sci_Vector$() {
  this.m3 = 0;
  this.m4 = null;
  $n_sci_Vector$ = this;
  try {
    $m_sc_StringOps$();
    var $x_1 = $m_jl_Integer$().ne($m_jl_System$SystemProperties$().j2("scala.collection.immutable.Vector.defaultApplyPreferredMaxLength", "250"), 10, 214748364);
  } catch (e) {
    if (false) {
      var $x_1 = 250;
    } else {
      var $x_1;
      throw e;
    }
  }
  this.m3 = $x_1;
  this.m4 = new $c_sci_NewVectorIterator($m_sci_Vector0$(), 0, 0);
}
$p = $c_sci_Vector$.prototype = new $h_O();
$p.constructor = $c_sci_Vector$;
/** @constructor */
function $h_sci_Vector$() {
}
$h_sci_Vector$.prototype = $p;
$p.cP = (function(elems) {
  return this.iY(elems);
});
$p.iY = (function(it) {
  if ((it instanceof $c_sci_Vector)) {
    return it;
  } else {
    var knownSize = it.u();
    if ((knownSize === 0)) {
      return $m_sci_Vector0$();
    } else if (((((knownSize - 1) | 0) >>> 0) <= 31)) {
      matchResult3: {
        var $x_1;
        if ((it instanceof $c_sci_ArraySeq$ofRef)) {
          var x = it.a9().aI();
          if (((x !== null) && (x === $d_O.l()))) {
            var $x_1 = it.ci;
            break matchResult3;
          }
        }
        if ($is_sci_Iterable(it)) {
          var a1 = new $ac_O(knownSize);
          it.by(a1, 0, 2147483647);
          var $x_1 = a1;
          break matchResult3;
        }
        var a1$2 = new $ac_O(knownSize);
        it.h().by(a1$2, 0, 2147483647);
        var $x_1 = a1$2;
      }
      return new $c_sci_Vector1($x_1);
    } else {
      return new $c_sci_VectorBuilder().mu(it).nw();
    }
  }
});
$p.aa = (function(source) {
  return this.iY(source);
});
$p.aH = (function() {
  return new $c_sci_VectorBuilder();
});
var $d_sci_Vector$ = new $TypeData().i($c_sci_Vector$, "scala.collection.immutable.Vector$", ({
  gJ: 1,
  a: 1,
  G: 1,
  Y: 1,
  al: 1
}));
var $n_sci_Vector$;
function $m_sci_Vector$() {
  if ((!$n_sci_Vector$)) {
    $n_sci_Vector$ = new $c_sci_Vector$();
  }
  return $n_sci_Vector$;
}
function $p_sci_VectorBuilder__leftAlignPrefix__V($thiz) {
  var a = null;
  var aParent = null;
  if (($thiz.E >= 6)) {
    a = $thiz.ax;
    var i = (($thiz.B >>> 25) | 0);
    if ((i > 0)) {
      var src = a;
      var dest = a;
      var length = ((64 - i) | 0);
      src.t(i, dest, 0, length);
    }
    var num = $thiz.B;
    var t = (((num >> 24) >>> 7) | 0);
    var newOffset = (((33554431 & ((num + t) | 0)) - t) | 0);
    $thiz.x = (($thiz.x - (($thiz.B - newOffset) | 0)) | 0);
    $thiz.B = newOffset;
    if (((($thiz.x >>> 25) | 0) === 0)) {
      $thiz.E = 5;
    }
    aParent = a;
    a = a.a[0];
  }
  if (($thiz.E >= 5)) {
    if ((a === null)) {
      a = $thiz.M;
    }
    var i$2 = (31 & (($thiz.B >>> 20) | 0));
    if (($thiz.E === 5)) {
      if ((i$2 > 0)) {
        var src$1 = a;
        var dest$1 = a;
        var length$1 = ((32 - i$2) | 0);
        src$1.t(i$2, dest$1, 0, length$1);
      }
      $thiz.M = a;
      var num$1 = $thiz.B;
      var t$1 = (((num$1 >> 19) >>> 12) | 0);
      var newOffset$1 = (((1048575 & ((num$1 + t$1) | 0)) - t$1) | 0);
      $thiz.x = (($thiz.x - (($thiz.B - newOffset$1) | 0)) | 0);
      $thiz.B = newOffset$1;
      if (((($thiz.x >>> 20) | 0) === 0)) {
        $thiz.E = 4;
      }
    } else {
      if ((i$2 > 0)) {
        a = $m_ju_Arrays$().a0(a, i$2, 32);
      }
      aParent.a[0] = a;
    }
    aParent = a;
    a = a.a[0];
  }
  if (($thiz.E >= 4)) {
    if ((a === null)) {
      a = $thiz.G;
    }
    var i$3 = (31 & (($thiz.B >>> 15) | 0));
    if (($thiz.E === 4)) {
      if ((i$3 > 0)) {
        var src$2 = a;
        var dest$2 = a;
        var length$2 = ((32 - i$3) | 0);
        src$2.t(i$3, dest$2, 0, length$2);
      }
      $thiz.G = a;
      var num$2 = $thiz.B;
      var t$2 = (((num$2 >> 14) >>> 17) | 0);
      var newOffset$2 = (((32767 & ((num$2 + t$2) | 0)) - t$2) | 0);
      $thiz.x = (($thiz.x - (($thiz.B - newOffset$2) | 0)) | 0);
      $thiz.B = newOffset$2;
      if (((($thiz.x >>> 15) | 0) === 0)) {
        $thiz.E = 3;
      }
    } else {
      if ((i$3 > 0)) {
        a = $m_ju_Arrays$().a0(a, i$3, 32);
      }
      aParent.a[0] = a;
    }
    aParent = a;
    a = a.a[0];
  }
  if (($thiz.E >= 3)) {
    if ((a === null)) {
      a = $thiz.C;
    }
    var i$4 = (31 & (($thiz.B >>> 10) | 0));
    if (($thiz.E === 3)) {
      if ((i$4 > 0)) {
        var src$3 = a;
        var dest$3 = a;
        var length$3 = ((32 - i$4) | 0);
        src$3.t(i$4, dest$3, 0, length$3);
      }
      $thiz.C = a;
      var num$3 = $thiz.B;
      var t$3 = (((num$3 >> 9) >>> 22) | 0);
      var newOffset$3 = (((1023 & ((num$3 + t$3) | 0)) - t$3) | 0);
      $thiz.x = (($thiz.x - (($thiz.B - newOffset$3) | 0)) | 0);
      $thiz.B = newOffset$3;
      if (((($thiz.x >>> 10) | 0) === 0)) {
        $thiz.E = 2;
      }
    } else {
      if ((i$4 > 0)) {
        a = $m_ju_Arrays$().a0(a, i$4, 32);
      }
      aParent.a[0] = a;
    }
    aParent = a;
    a = a.a[0];
  }
  if (($thiz.E >= 2)) {
    if ((a === null)) {
      a = $thiz.A;
    }
    var i$5 = (31 & (($thiz.B >>> 5) | 0));
    if (($thiz.E === 2)) {
      if ((i$5 > 0)) {
        var src$4 = a;
        var dest$4 = a;
        var length$4 = ((32 - i$5) | 0);
        src$4.t(i$5, dest$4, 0, length$4);
      }
      $thiz.A = a;
      var num$4 = $thiz.B;
      var t$4 = (((num$4 >> 4) >>> 27) | 0);
      var newOffset$4 = (((31 & ((num$4 + t$4) | 0)) - t$4) | 0);
      $thiz.x = (($thiz.x - (($thiz.B - newOffset$4) | 0)) | 0);
      $thiz.B = newOffset$4;
      if (((($thiz.x >>> 5) | 0) === 0)) {
        $thiz.E = 1;
      }
    } else {
      if ((i$5 > 0)) {
        a = $m_ju_Arrays$().a0(a, i$5, 32);
      }
      aParent.a[0] = a;
    }
    aParent = a;
    a = a.a[0];
  }
  if (($thiz.E >= 1)) {
    if ((a === null)) {
      a = $thiz.J;
    }
    var i$6 = (31 & $thiz.B);
    if (($thiz.E === 1)) {
      if ((i$6 > 0)) {
        var src$5 = a;
        var dest$5 = a;
        var length$5 = ((32 - i$6) | 0);
        src$5.t(i$6, dest$5, 0, length$5);
      }
      $thiz.J = a;
      $thiz.D = (($thiz.D - $thiz.B) | 0);
      $thiz.B = 0;
    } else {
      if ((i$6 > 0)) {
        a = $m_ju_Arrays$().a0(a, i$6, 32);
      }
      aParent.a[0] = a;
    }
  }
  $thiz.gE = false;
}
function $p_sci_VectorBuilder__addArr1__AO__V($thiz, data) {
  var dl = data.a.length;
  if ((dl > 0)) {
    if (($thiz.D === 32)) {
      $p_sci_VectorBuilder__advance__V($thiz);
    }
    var a = ((32 - $thiz.D) | 0);
    var copy1 = ((a < dl) ? a : dl);
    var copy2 = ((dl - copy1) | 0);
    var dest = $thiz.J;
    var destPos = $thiz.D;
    data.t(0, dest, destPos, copy1);
    $thiz.D = (($thiz.D + copy1) | 0);
    if ((copy2 > 0)) {
      $p_sci_VectorBuilder__advance__V($thiz);
      var dest$1 = $thiz.J;
      data.t(copy1, dest$1, 0, copy2);
      $thiz.D = (($thiz.D + copy2) | 0);
    }
  }
}
function $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, slice, dim) {
  if ((slice.a.length === 0)) {
    return (void 0);
  }
  if (($thiz.D === 32)) {
    $p_sci_VectorBuilder__advance__V($thiz);
  }
  var sl = slice.a.length;
  switch (dim) {
    case 2: {
      var a = (31 & ((((1024 - $thiz.x) | 0) >>> 5) | 0));
      var copy1 = ((a < sl) ? a : sl);
      var copy2 = ((sl - copy1) | 0);
      var destPos = (31 & (($thiz.x >>> 5) | 0));
      var dest = $thiz.A;
      slice.t(0, dest, destPos, copy1);
      $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy1 << 5));
      if ((copy2 > 0)) {
        var dest$1 = $thiz.A;
        slice.t(copy1, dest$1, 0, copy2);
        $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy2 << 5));
      }
      break;
    }
    case 3: {
      var num = $thiz.x;
      var t = (((num >> 9) >>> 22) | 0);
      if (((((1023 & ((num + t) | 0)) - t) | 0) !== 0)) {
        var f = ((e$3) => {
          $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, e$3, 2);
        });
        var len = slice.a.length;
        var i = 0;
        if ((slice !== null)) {
          while ((i < len)) {
            var x0 = slice.a[i];
            f(x0);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_I)) {
          while ((i < len)) {
            var x0$1 = slice.a[i];
            f(x0$1);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_D)) {
          while ((i < len)) {
            var x0$2 = slice.a[i];
            f(x0$2);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_J)) {
          while ((i < len)) {
            var $x_1 = slice.a;
            var $x_2 = (i << 1);
            var x0$3_$_lo = $x_1[$x_2];
            var x0$3_$_hi = $x_1[(($x_2 + 1) | 0)];
            f($bL(x0$3_$_lo, x0$3_$_hi));
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_F)) {
          while ((i < len)) {
            var x0$4 = slice.a[i];
            f(x0$4);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_C)) {
          while ((i < len)) {
            var x0$5 = slice.a[i];
            f($bC(x0$5));
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_B)) {
          while ((i < len)) {
            var x0$6 = slice.a[i];
            f(x0$6);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_S)) {
          while ((i < len)) {
            var x0$7 = slice.a[i];
            f(x0$7);
            i = ((1 + i) | 0);
          }
        } else if ((slice instanceof $ac_Z)) {
          while ((i < len)) {
            var x0$8 = slice.a[i];
            f(x0$8);
            i = ((1 + i) | 0);
          }
        } else {
          throw new $c_s_MatchError(slice);
        }
        return (void 0);
      }
      var a$1 = (31 & ((((32768 - $thiz.x) | 0) >>> 10) | 0));
      var copy1$2 = ((a$1 < sl) ? a$1 : sl);
      var copy2$2 = ((sl - copy1$2) | 0);
      var destPos$2 = (31 & (($thiz.x >>> 10) | 0));
      var dest$2 = $thiz.C;
      slice.t(0, dest$2, destPos$2, copy1$2);
      $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy1$2 << 10));
      if ((copy2$2 > 0)) {
        var dest$3 = $thiz.C;
        slice.t(copy1$2, dest$3, 0, copy2$2);
        $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy2$2 << 10));
      }
      break;
    }
    case 4: {
      var num$1 = $thiz.x;
      var t$1 = (((num$1 >> 14) >>> 17) | 0);
      if (((((32767 & ((num$1 + t$1) | 0)) - t$1) | 0) !== 0)) {
        var f$1 = ((e$3$1) => {
          $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, e$3$1, 3);
        });
        var len$1 = slice.a.length;
        var i$1 = 0;
        if ((slice !== null)) {
          while ((i$1 < len$1)) {
            var x0$9 = slice.a[i$1];
            f$1(x0$9);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_I)) {
          while ((i$1 < len$1)) {
            var x0$10 = slice.a[i$1];
            f$1(x0$10);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_D)) {
          while ((i$1 < len$1)) {
            var x0$11 = slice.a[i$1];
            f$1(x0$11);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_J)) {
          while ((i$1 < len$1)) {
            var $x_3 = slice.a;
            var $x_4 = (i$1 << 1);
            var x0$12_$_lo = $x_3[$x_4];
            var x0$12_$_hi = $x_3[(($x_4 + 1) | 0)];
            f$1($bL(x0$12_$_lo, x0$12_$_hi));
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_F)) {
          while ((i$1 < len$1)) {
            var x0$13 = slice.a[i$1];
            f$1(x0$13);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_C)) {
          while ((i$1 < len$1)) {
            var x0$14 = slice.a[i$1];
            f$1($bC(x0$14));
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_B)) {
          while ((i$1 < len$1)) {
            var x0$15 = slice.a[i$1];
            f$1(x0$15);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_S)) {
          while ((i$1 < len$1)) {
            var x0$16 = slice.a[i$1];
            f$1(x0$16);
            i$1 = ((1 + i$1) | 0);
          }
        } else if ((slice instanceof $ac_Z)) {
          while ((i$1 < len$1)) {
            var x0$17 = slice.a[i$1];
            f$1(x0$17);
            i$1 = ((1 + i$1) | 0);
          }
        } else {
          throw new $c_s_MatchError(slice);
        }
        return (void 0);
      }
      var a$2 = (31 & ((((1048576 - $thiz.x) | 0) >>> 15) | 0));
      var copy1$3 = ((a$2 < sl) ? a$2 : sl);
      var copy2$3 = ((sl - copy1$3) | 0);
      var destPos$3 = (31 & (($thiz.x >>> 15) | 0));
      var dest$4 = $thiz.G;
      slice.t(0, dest$4, destPos$3, copy1$3);
      $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy1$3 << 15));
      if ((copy2$3 > 0)) {
        var dest$5 = $thiz.G;
        slice.t(copy1$3, dest$5, 0, copy2$3);
        $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy2$3 << 15));
      }
      break;
    }
    case 5: {
      var num$2 = $thiz.x;
      var t$2 = (((num$2 >> 19) >>> 12) | 0);
      if (((((1048575 & ((num$2 + t$2) | 0)) - t$2) | 0) !== 0)) {
        var f$2 = ((e$3$2) => {
          $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, e$3$2, 4);
        });
        var len$2 = slice.a.length;
        var i$2 = 0;
        if ((slice !== null)) {
          while ((i$2 < len$2)) {
            var x0$18 = slice.a[i$2];
            f$2(x0$18);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_I)) {
          while ((i$2 < len$2)) {
            var x0$19 = slice.a[i$2];
            f$2(x0$19);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_D)) {
          while ((i$2 < len$2)) {
            var x0$20 = slice.a[i$2];
            f$2(x0$20);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_J)) {
          while ((i$2 < len$2)) {
            var $x_5 = slice.a;
            var $x_6 = (i$2 << 1);
            var x0$21_$_lo = $x_5[$x_6];
            var x0$21_$_hi = $x_5[(($x_6 + 1) | 0)];
            f$2($bL(x0$21_$_lo, x0$21_$_hi));
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_F)) {
          while ((i$2 < len$2)) {
            var x0$22 = slice.a[i$2];
            f$2(x0$22);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_C)) {
          while ((i$2 < len$2)) {
            var x0$23 = slice.a[i$2];
            f$2($bC(x0$23));
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_B)) {
          while ((i$2 < len$2)) {
            var x0$24 = slice.a[i$2];
            f$2(x0$24);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_S)) {
          while ((i$2 < len$2)) {
            var x0$25 = slice.a[i$2];
            f$2(x0$25);
            i$2 = ((1 + i$2) | 0);
          }
        } else if ((slice instanceof $ac_Z)) {
          while ((i$2 < len$2)) {
            var x0$26 = slice.a[i$2];
            f$2(x0$26);
            i$2 = ((1 + i$2) | 0);
          }
        } else {
          throw new $c_s_MatchError(slice);
        }
        return (void 0);
      }
      var a$3 = (31 & ((((33554432 - $thiz.x) | 0) >>> 20) | 0));
      var copy1$4 = ((a$3 < sl) ? a$3 : sl);
      var copy2$4 = ((sl - copy1$4) | 0);
      var destPos$4 = (31 & (($thiz.x >>> 20) | 0));
      var dest$6 = $thiz.M;
      slice.t(0, dest$6, destPos$4, copy1$4);
      $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy1$4 << 20));
      if ((copy2$4 > 0)) {
        var dest$7 = $thiz.M;
        slice.t(copy1$4, dest$7, 0, copy2$4);
        $p_sci_VectorBuilder__advanceN__I__V($thiz, (copy2$4 << 20));
      }
      break;
    }
    case 6: {
      var num$3 = $thiz.x;
      var t$3 = (((num$3 >> 24) >>> 7) | 0);
      if (((((33554431 & ((num$3 + t$3) | 0)) - t$3) | 0) !== 0)) {
        var f$3 = ((e$3$3) => {
          $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, e$3$3, 5);
        });
        var len$3 = slice.a.length;
        var i$3 = 0;
        if ((slice !== null)) {
          while ((i$3 < len$3)) {
            var x0$27 = slice.a[i$3];
            f$3(x0$27);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_I)) {
          while ((i$3 < len$3)) {
            var x0$28 = slice.a[i$3];
            f$3(x0$28);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_D)) {
          while ((i$3 < len$3)) {
            var x0$29 = slice.a[i$3];
            f$3(x0$29);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_J)) {
          while ((i$3 < len$3)) {
            var $x_7 = slice.a;
            var $x_8 = (i$3 << 1);
            var x0$30_$_lo = $x_7[$x_8];
            var x0$30_$_hi = $x_7[(($x_8 + 1) | 0)];
            f$3($bL(x0$30_$_lo, x0$30_$_hi));
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_F)) {
          while ((i$3 < len$3)) {
            var x0$31 = slice.a[i$3];
            f$3(x0$31);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_C)) {
          while ((i$3 < len$3)) {
            var x0$32 = slice.a[i$3];
            f$3($bC(x0$32));
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_B)) {
          while ((i$3 < len$3)) {
            var x0$33 = slice.a[i$3];
            f$3(x0$33);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_S)) {
          while ((i$3 < len$3)) {
            var x0$34 = slice.a[i$3];
            f$3(x0$34);
            i$3 = ((1 + i$3) | 0);
          }
        } else if ((slice instanceof $ac_Z)) {
          while ((i$3 < len$3)) {
            var x0$35 = slice.a[i$3];
            f$3(x0$35);
            i$3 = ((1 + i$3) | 0);
          }
        } else {
          throw new $c_s_MatchError(slice);
        }
        return (void 0);
      }
      var destPos$5 = (($thiz.x >>> 25) | 0);
      if ((((destPos$5 + sl) | 0) > 64)) {
        throw $ct_jl_IllegalArgumentException__T__(new $c_jl_IllegalArgumentException(), "exceeding 2^31 elements");
      }
      var dest$8 = $thiz.ax;
      slice.t(0, dest$8, destPos$5, sl);
      $p_sci_VectorBuilder__advanceN__I__V($thiz, (sl << 25));
      break;
    }
    default: {
      throw new $c_s_MatchError(dim);
    }
  }
}
function $p_sci_VectorBuilder__addVector__sci_Vector__sci_VectorBuilder($thiz, xs) {
  var sliceCount = xs.cu();
  var sliceIdx = 0;
  while ((sliceIdx < sliceCount)) {
    var slice = xs.ct(sliceIdx);
    matchResult26: {
      var idx = sliceIdx;
      var c = (((sliceCount + ((sliceCount >>> 31) | 0)) | 0) >> 1);
      var a = ((idx - c) | 0);
      var sign = (a >> 31);
      var x37 = ((((1 + c) | 0) - (((a ^ sign) - sign) | 0)) | 0);
      if ((x37 === 1)) {
        $p_sci_VectorBuilder__addArr1__AO__V($thiz, slice);
        break matchResult26;
      }
      if ((($thiz.D === 32) || ($thiz.D === 0))) {
        $p_sci_VectorBuilder__addArrN__AO__I__V($thiz, slice, x37);
        break matchResult26;
      }
      $m_sci_VectorStatics$().iT(((x37 - 2) | 0), slice, new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((data$3) => {
        $p_sci_VectorBuilder__addArr1__AO__V($thiz, data$3);
      })));
    }
    sliceIdx = ((1 + sliceIdx) | 0);
  }
  return $thiz;
}
function $p_sci_VectorBuilder__advance__V($thiz) {
  var idx = ((32 + $thiz.x) | 0);
  var xor = (idx ^ $thiz.x);
  $thiz.x = idx;
  $thiz.D = 0;
  $p_sci_VectorBuilder__advance1__I__I__V($thiz, idx, xor);
}
function $p_sci_VectorBuilder__advanceN__I__V($thiz, n) {
  if ((n > 0)) {
    var idx = (($thiz.x + n) | 0);
    var xor = (idx ^ $thiz.x);
    $thiz.x = idx;
    $thiz.D = 0;
    $p_sci_VectorBuilder__advance1__I__I__V($thiz, idx, xor);
  }
}
function $p_sci_VectorBuilder__advance1__I__I__V($thiz, idx, xor) {
  if ((xor <= 0)) {
    throw $ct_jl_IllegalArgumentException__T__(new $c_jl_IllegalArgumentException(), ((((((((((((((((("advance1(" + idx) + ", ") + xor) + "): a1=") + $thiz.J) + ", a2=") + $thiz.A) + ", a3=") + $thiz.C) + ", a4=") + $thiz.G) + ", a5=") + $thiz.M) + ", a6=") + $thiz.ax) + ", depth=") + $thiz.E));
  } else if ((xor < 1024)) {
    if (($thiz.E <= 1)) {
      $thiz.A = new ($d_O.r().r().C)(32);
      $thiz.A.a[0] = $thiz.J;
      $thiz.E = 2;
    }
    $thiz.J = new $ac_O(32);
    $thiz.A.a[(31 & ((idx >>> 5) | 0))] = $thiz.J;
  } else if ((xor < 32768)) {
    if (($thiz.E <= 2)) {
      $thiz.C = new ($d_O.r().r().r().C)(32);
      $thiz.C.a[0] = $thiz.A;
      $thiz.E = 3;
    }
    $thiz.J = new $ac_O(32);
    $thiz.A = new ($d_O.r().r().C)(32);
    $thiz.A.a[(31 & ((idx >>> 5) | 0))] = $thiz.J;
    $thiz.C.a[(31 & ((idx >>> 10) | 0))] = $thiz.A;
  } else if ((xor < 1048576)) {
    if (($thiz.E <= 3)) {
      $thiz.G = new ($d_O.r().r().r().r().C)(32);
      $thiz.G.a[0] = $thiz.C;
      $thiz.E = 4;
    }
    $thiz.J = new $ac_O(32);
    $thiz.A = new ($d_O.r().r().C)(32);
    $thiz.C = new ($d_O.r().r().r().C)(32);
    $thiz.A.a[(31 & ((idx >>> 5) | 0))] = $thiz.J;
    $thiz.C.a[(31 & ((idx >>> 10) | 0))] = $thiz.A;
    $thiz.G.a[(31 & ((idx >>> 15) | 0))] = $thiz.C;
  } else if ((xor < 33554432)) {
    if (($thiz.E <= 4)) {
      $thiz.M = new ($d_O.r().r().r().r().r().C)(32);
      $thiz.M.a[0] = $thiz.G;
      $thiz.E = 5;
    }
    $thiz.J = new $ac_O(32);
    $thiz.A = new ($d_O.r().r().C)(32);
    $thiz.C = new ($d_O.r().r().r().C)(32);
    $thiz.G = new ($d_O.r().r().r().r().C)(32);
    $thiz.A.a[(31 & ((idx >>> 5) | 0))] = $thiz.J;
    $thiz.C.a[(31 & ((idx >>> 10) | 0))] = $thiz.A;
    $thiz.G.a[(31 & ((idx >>> 15) | 0))] = $thiz.C;
    $thiz.M.a[(31 & ((idx >>> 20) | 0))] = $thiz.G;
  } else {
    if (($thiz.E <= 5)) {
      $thiz.ax = new ($d_O.r().r().r().r().r().r().C)(64);
      $thiz.ax.a[0] = $thiz.M;
      $thiz.E = 6;
    }
    $thiz.J = new $ac_O(32);
    $thiz.A = new ($d_O.r().r().C)(32);
    $thiz.C = new ($d_O.r().r().r().C)(32);
    $thiz.G = new ($d_O.r().r().r().r().C)(32);
    $thiz.M = new ($d_O.r().r().r().r().r().C)(32);
    $thiz.A.a[(31 & ((idx >>> 5) | 0))] = $thiz.J;
    $thiz.C.a[(31 & ((idx >>> 10) | 0))] = $thiz.A;
    $thiz.G.a[(31 & ((idx >>> 15) | 0))] = $thiz.C;
    $thiz.M.a[(31 & ((idx >>> 20) | 0))] = $thiz.G;
    $thiz.ax.a[((idx >>> 25) | 0)] = $thiz.M;
  }
}
/** @constructor */
function $c_sci_VectorBuilder() {
  this.ax = null;
  this.M = null;
  this.G = null;
  this.C = null;
  this.A = null;
  this.J = null;
  this.D = 0;
  this.x = 0;
  this.B = 0;
  this.gE = false;
  this.E = 0;
  this.J = new $ac_O(32);
  this.D = 0;
  this.x = 0;
  this.B = 0;
  this.gE = false;
  this.E = 1;
}
$p = $c_sci_VectorBuilder.prototype = new $h_O();
$p.constructor = $c_sci_VectorBuilder;
/** @constructor */
function $h_sci_VectorBuilder() {
}
$h_sci_VectorBuilder.prototype = $p;
$p.b6 = (function(size) {
});
$p.pN = (function(v) {
  var x28 = v.cu();
  switch (x28) {
    case 0: {
      break;
    }
    case 1: {
      this.E = 1;
      var i = v.d.a.length;
      this.D = (31 & i);
      this.x = ((i - this.D) | 0);
      var a = v.d;
      this.J = ((a.a.length === 32) ? a : $m_ju_Arrays$().a0(a, 0, 32));
      break;
    }
    case 3: {
      var d2 = v.bd;
      var a$1 = v.f;
      this.J = ((a$1.a.length === 32) ? a$1 : $m_ju_Arrays$().a0(a$1, 0, 32));
      this.E = 2;
      this.B = ((32 - v.bw) | 0);
      var i$1 = ((v.g + this.B) | 0);
      this.D = (31 & i$1);
      this.x = ((i$1 - this.D) | 0);
      this.A = new ($d_O.r().r().C)(32);
      this.A.a[0] = v.d;
      var dest = this.A;
      var length = d2.a.length;
      d2.t(0, dest, 1, length);
      this.A.a[((1 + d2.a.length) | 0)] = this.J;
      break;
    }
    case 5: {
      var d3 = v.aO;
      var s2 = v.aP;
      var a$2 = v.f;
      this.J = ((a$2.a.length === 32) ? a$2 : $m_ju_Arrays$().a0(a$2, 0, 32));
      this.E = 3;
      this.B = ((1024 - v.ba) | 0);
      var i$2 = ((v.g + this.B) | 0);
      this.D = (31 & i$2);
      this.x = ((i$2 - this.D) | 0);
      this.C = new ($d_O.r().r().r().C)(32);
      this.C.a[0] = $m_sci_VectorStatics$().cp(v.d, v.bj);
      var dest$1 = this.C;
      var length$1 = d3.a.length;
      d3.t(0, dest$1, 1, length$1);
      this.A = $m_ju_Arrays$().O(s2, 32);
      this.C.a[((1 + d3.a.length) | 0)] = this.A;
      this.A.a[s2.a.length] = this.J;
      break;
    }
    case 7: {
      var d4 = v.ar;
      var s3 = v.at;
      var s2$2 = v.as;
      var a$3 = v.f;
      this.J = ((a$3.a.length === 32) ? a$3 : $m_ju_Arrays$().a0(a$3, 0, 32));
      this.E = 4;
      this.B = ((32768 - v.aE) | 0);
      var i$3 = ((v.g + this.B) | 0);
      this.D = (31 & i$3);
      this.x = ((i$3 - this.D) | 0);
      this.G = new ($d_O.r().r().r().r().C)(32);
      this.G.a[0] = $m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp(v.d, v.aY), v.aZ);
      var dest$2 = this.G;
      var length$2 = d4.a.length;
      d4.t(0, dest$2, 1, length$2);
      this.C = $m_ju_Arrays$().O(s3, 32);
      this.A = $m_ju_Arrays$().O(s2$2, 32);
      this.G.a[((1 + d4.a.length) | 0)] = this.C;
      this.C.a[s3.a.length] = this.A;
      this.A.a[s2$2.a.length] = this.J;
      break;
    }
    case 9: {
      var d5 = v.a1;
      var s4 = v.a4;
      var s3$2 = v.a3;
      var s2$3 = v.a2;
      var a$4 = v.f;
      this.J = ((a$4.a.length === 32) ? a$4 : $m_ju_Arrays$().a0(a$4, 0, 32));
      this.E = 5;
      this.B = ((1048576 - v.aj) | 0);
      var i$4 = ((v.g + this.B) | 0);
      this.D = (31 & i$4);
      this.x = ((i$4 - this.D) | 0);
      this.M = new ($d_O.r().r().r().r().r().C)(32);
      this.M.a[0] = $m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp(v.d, v.au), v.av), v.aw);
      var dest$3 = this.M;
      var length$3 = d5.a.length;
      d5.t(0, dest$3, 1, length$3);
      this.G = $m_ju_Arrays$().O(s4, 32);
      this.C = $m_ju_Arrays$().O(s3$2, 32);
      this.A = $m_ju_Arrays$().O(s2$3, 32);
      this.M.a[((1 + d5.a.length) | 0)] = this.G;
      this.G.a[s4.a.length] = this.C;
      this.C.a[s3$2.a.length] = this.A;
      this.A.a[s2$3.a.length] = this.J;
      break;
    }
    case 11: {
      var d6 = v.R;
      var s5 = v.V;
      var s4$2 = v.U;
      var s3$3 = v.T;
      var s2$4 = v.S;
      var a$5 = v.f;
      this.J = ((a$5.a.length === 32) ? a$5 : $m_ju_Arrays$().a0(a$5, 0, 32));
      this.E = 6;
      this.B = ((33554432 - v.ad) | 0);
      var i$5 = ((v.g + this.B) | 0);
      this.D = (31 & i$5);
      this.x = ((i$5 - this.D) | 0);
      this.ax = new ($d_O.r().r().r().r().r().r().C)(64);
      this.ax.a[0] = $m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp($m_sci_VectorStatics$().cp(v.d, v.ak), v.al), v.am), v.an);
      var dest$4 = this.ax;
      var length$4 = d6.a.length;
      d6.t(0, dest$4, 1, length$4);
      this.M = $m_ju_Arrays$().O(s5, 32);
      this.G = $m_ju_Arrays$().O(s4$2, 32);
      this.C = $m_ju_Arrays$().O(s3$3, 32);
      this.A = $m_ju_Arrays$().O(s2$4, 32);
      this.ax.a[((1 + d6.a.length) | 0)] = this.M;
      this.M.a[s5.a.length] = this.G;
      this.G.a[s4$2.a.length] = this.C;
      this.C.a[s3$3.a.length] = this.A;
      this.A.a[s2$4.a.length] = this.J;
      break;
    }
    default: {
      throw new $c_s_MatchError(x28);
    }
  }
  if (((this.D === 0) && (this.x > 0))) {
    this.D = 32;
    this.x = ((this.x - 32) | 0);
  }
  return this;
});
$p.oo = (function(elem) {
  if ((this.D === 32)) {
    $p_sci_VectorBuilder__advance__V(this);
  }
  this.J.a[this.D] = elem;
  this.D = ((1 + this.D) | 0);
  return this;
});
$p.mu = (function(xs) {
  return ((xs instanceof $c_sci_Vector) ? ((((this.D === 0) && (this.x === 0)) && (!this.gE)) ? this.pN(xs) : $p_sci_VectorBuilder__addVector__sci_Vector__sci_VectorBuilder(this, xs)) : $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, xs));
});
$p.nw = (function() {
  if (this.gE) {
    $p_sci_VectorBuilder__leftAlignPrefix__V(this);
  }
  var len = ((this.D + this.x) | 0);
  var realLen = ((len - this.B) | 0);
  if ((realLen === 0)) {
    $m_sci_Vector$();
    return $m_sci_Vector0$();
  } else if ((len < 0)) {
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("Vector cannot have negative size " + len));
  } else if ((len <= 32)) {
    var a = this.J;
    return new $c_sci_Vector1(((a.a.length === realLen) ? a : $m_ju_Arrays$().O(a, realLen)));
  } else if ((len <= 1024)) {
    var i1 = (31 & ((len - 1) | 0));
    var i2 = ((((len - 1) | 0) >>> 5) | 0);
    var data = $m_ju_Arrays$().a0(this.A, 1, i2);
    var prefix1 = this.A.a[0];
    var a$1 = this.A.a[i2];
    var len$1 = ((1 + i1) | 0);
    var suffix1 = ((a$1.a.length === len$1) ? a$1 : $m_ju_Arrays$().O(a$1, len$1));
    return new $c_sci_Vector2(prefix1, ((32 - this.B) | 0), data, suffix1, realLen);
  } else if ((len <= 32768)) {
    var i1$2 = (31 & ((len - 1) | 0));
    var i2$2 = (31 & ((((len - 1) | 0) >>> 5) | 0));
    var i3 = ((((len - 1) | 0) >>> 10) | 0);
    var data$2 = $m_ju_Arrays$().a0(this.C, 1, i3);
    var a$2 = this.C.a[0];
    var prefix2 = $m_ju_Arrays$().a0(a$2, 1, a$2.a.length);
    var prefix1$2 = this.C.a[0].a[0];
    var suffix2 = $m_ju_Arrays$().O(this.C.a[i3], i2$2);
    var a$3 = this.C.a[i3].a[i2$2];
    var len$2 = ((1 + i1$2) | 0);
    var suffix1$2 = ((a$3.a.length === len$2) ? a$3 : $m_ju_Arrays$().O(a$3, len$2));
    var len1 = prefix1$2.a.length;
    return new $c_sci_Vector3(prefix1$2, len1, prefix2, ((len1 + (prefix2.a.length << 5)) | 0), data$2, suffix2, suffix1$2, realLen);
  } else if ((len <= 1048576)) {
    var i1$3 = (31 & ((len - 1) | 0));
    var i2$3 = (31 & ((((len - 1) | 0) >>> 5) | 0));
    var i3$2 = (31 & ((((len - 1) | 0) >>> 10) | 0));
    var i4 = ((((len - 1) | 0) >>> 15) | 0);
    var data$3 = $m_ju_Arrays$().a0(this.G, 1, i4);
    var a$4 = this.G.a[0];
    var prefix3 = $m_ju_Arrays$().a0(a$4, 1, a$4.a.length);
    var a$5 = this.G.a[0].a[0];
    var prefix2$2 = $m_ju_Arrays$().a0(a$5, 1, a$5.a.length);
    var prefix1$3 = this.G.a[0].a[0].a[0];
    var suffix3 = $m_ju_Arrays$().O(this.G.a[i4], i3$2);
    var suffix2$2 = $m_ju_Arrays$().O(this.G.a[i4].a[i3$2], i2$3);
    var a$6 = this.G.a[i4].a[i3$2].a[i2$3];
    var len$3 = ((1 + i1$3) | 0);
    var suffix1$3 = ((a$6.a.length === len$3) ? a$6 : $m_ju_Arrays$().O(a$6, len$3));
    var len1$2 = prefix1$3.a.length;
    var len12$2 = ((len1$2 + (prefix2$2.a.length << 5)) | 0);
    return new $c_sci_Vector4(prefix1$3, len1$2, prefix2$2, len12$2, prefix3, ((len12$2 + (prefix3.a.length << 10)) | 0), data$3, suffix3, suffix2$2, suffix1$3, realLen);
  } else if ((len <= 33554432)) {
    var i1$4 = (31 & ((len - 1) | 0));
    var i2$4 = (31 & ((((len - 1) | 0) >>> 5) | 0));
    var i3$3 = (31 & ((((len - 1) | 0) >>> 10) | 0));
    var i4$2 = (31 & ((((len - 1) | 0) >>> 15) | 0));
    var i5 = ((((len - 1) | 0) >>> 20) | 0);
    var data$4 = $m_ju_Arrays$().a0(this.M, 1, i5);
    var a$7 = this.M.a[0];
    var prefix4 = $m_ju_Arrays$().a0(a$7, 1, a$7.a.length);
    var a$8 = this.M.a[0].a[0];
    var prefix3$2 = $m_ju_Arrays$().a0(a$8, 1, a$8.a.length);
    var a$9 = this.M.a[0].a[0].a[0];
    var prefix2$3 = $m_ju_Arrays$().a0(a$9, 1, a$9.a.length);
    var prefix1$4 = this.M.a[0].a[0].a[0].a[0];
    var suffix4 = $m_ju_Arrays$().O(this.M.a[i5], i4$2);
    var suffix3$2 = $m_ju_Arrays$().O(this.M.a[i5].a[i4$2], i3$3);
    var suffix2$3 = $m_ju_Arrays$().O(this.M.a[i5].a[i4$2].a[i3$3], i2$4);
    var a$10 = this.M.a[i5].a[i4$2].a[i3$3].a[i2$4];
    var len$4 = ((1 + i1$4) | 0);
    var suffix1$4 = ((a$10.a.length === len$4) ? a$10 : $m_ju_Arrays$().O(a$10, len$4));
    var len1$3 = prefix1$4.a.length;
    var len12$3 = ((len1$3 + (prefix2$3.a.length << 5)) | 0);
    var len123$2 = ((len12$3 + (prefix3$2.a.length << 10)) | 0);
    return new $c_sci_Vector5(prefix1$4, len1$3, prefix2$3, len12$3, prefix3$2, len123$2, prefix4, ((len123$2 + (prefix4.a.length << 15)) | 0), data$4, suffix4, suffix3$2, suffix2$3, suffix1$4, realLen);
  } else {
    var i1$5 = (31 & ((len - 1) | 0));
    var i2$5 = (31 & ((((len - 1) | 0) >>> 5) | 0));
    var i3$4 = (31 & ((((len - 1) | 0) >>> 10) | 0));
    var i4$3 = (31 & ((((len - 1) | 0) >>> 15) | 0));
    var i5$2 = (31 & ((((len - 1) | 0) >>> 20) | 0));
    var i6 = ((((len - 1) | 0) >>> 25) | 0);
    var data$5 = $m_ju_Arrays$().a0(this.ax, 1, i6);
    var a$11 = this.ax.a[0];
    var prefix5 = $m_ju_Arrays$().a0(a$11, 1, a$11.a.length);
    var a$12 = this.ax.a[0].a[0];
    var prefix4$2 = $m_ju_Arrays$().a0(a$12, 1, a$12.a.length);
    var a$13 = this.ax.a[0].a[0].a[0];
    var prefix3$3 = $m_ju_Arrays$().a0(a$13, 1, a$13.a.length);
    var a$14 = this.ax.a[0].a[0].a[0].a[0];
    var prefix2$4 = $m_ju_Arrays$().a0(a$14, 1, a$14.a.length);
    var prefix1$5 = this.ax.a[0].a[0].a[0].a[0].a[0];
    var suffix5 = $m_ju_Arrays$().O(this.ax.a[i6], i5$2);
    var suffix4$2 = $m_ju_Arrays$().O(this.ax.a[i6].a[i5$2], i4$3);
    var suffix3$3 = $m_ju_Arrays$().O(this.ax.a[i6].a[i5$2].a[i4$3], i3$4);
    var suffix2$4 = $m_ju_Arrays$().O(this.ax.a[i6].a[i5$2].a[i4$3].a[i3$4], i2$5);
    var a$15 = this.ax.a[i6].a[i5$2].a[i4$3].a[i3$4].a[i2$5];
    var len$5 = ((1 + i1$5) | 0);
    var suffix1$5 = ((a$15.a.length === len$5) ? a$15 : $m_ju_Arrays$().O(a$15, len$5));
    var len1$4 = prefix1$5.a.length;
    var len12$4 = ((len1$4 + (prefix2$4.a.length << 5)) | 0);
    var len123$3 = ((len12$4 + (prefix3$3.a.length << 10)) | 0);
    var len1234$2 = ((len123$3 + (prefix4$2.a.length << 15)) | 0);
    return new $c_sci_Vector6(prefix1$5, len1$4, prefix2$4, len12$4, prefix3$3, len123$3, prefix4$2, len1234$2, prefix5, ((len1234$2 + (prefix5.a.length << 20)) | 0), data$5, suffix5, suffix4$2, suffix3$3, suffix2$4, suffix1$5, realLen);
  }
});
$p.p = (function() {
  return (((((((("VectorBuilder(len1=" + this.D) + ", lenRest=") + this.x) + ", offset=") + this.B) + ", depth=") + this.E) + ")");
});
$p.aU = (function(elem) {
  return this.oo(elem);
});
$p.aT = (function(elems) {
  return this.mu(elems);
});
$p.aV = (function() {
  return this.nw();
});
var $d_sci_VectorBuilder = new $TypeData().i($c_sci_VectorBuilder, "scala.collection.immutable.VectorBuilder", ({
  gR: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1
}));
/** @constructor */
function $c_scm_ArrayBuffer$() {
  this.m6 = null;
  $n_scm_ArrayBuffer$ = this;
  this.m6 = new $ac_O(0);
}
$p = $c_scm_ArrayBuffer$.prototype = new $h_O();
$p.constructor = $c_scm_ArrayBuffer$;
/** @constructor */
function $h_scm_ArrayBuffer$() {
}
$h_scm_ArrayBuffer$.prototype = $p;
$p.cP = (function(elems) {
  return this.n4(elems);
});
$p.n4 = (function(coll) {
  var k = coll.u();
  if ((k >= 0)) {
    var array = this.nA(this.m6, 0, k);
    var actual = ($is_sc_Iterable(coll) ? coll.by(array, 0, 2147483647) : coll.h().by(array, 0, 2147483647));
    if ((actual !== k)) {
      throw $ct_jl_IllegalStateException__T__(new $c_jl_IllegalStateException(), ((("Copied " + actual) + " of ") + k));
    }
    return $ct_scm_ArrayBuffer__AO__I__(new $c_scm_ArrayBuffer(), array, k);
  } else {
    return $ct_scm_ArrayBuffer__(new $c_scm_ArrayBuffer()).mv(coll);
  }
});
$p.aH = (function() {
  return new $c_scm_ArrayBuffer$$anon$1();
});
$p.qJ = (function(arrayLen, targetLen) {
  if ((targetLen < 0)) {
    throw $ct_jl_RuntimeException__T__(new $c_jl_RuntimeException(), ((((("Overflow while resizing array of array-backed collection. Requested length: " + targetLen) + "; current length: ") + arrayLen) + "; increase: ") + ((targetLen - arrayLen) | 0)));
  } else if ((targetLen <= arrayLen)) {
    return (-1);
  } else {
    if ((targetLen > 2147483639)) {
      throw $ct_jl_RuntimeException__T__(new $c_jl_RuntimeException(), ((("Array of array-backed collection exceeds VM length limit of 2147483639. Requested length: " + targetLen) + "; current length: ") + arrayLen));
    }
    if ((arrayLen > 1073741819)) {
      return 2147483639;
    } else {
      var x = (arrayLen << 1);
      var y = ((x > 16) ? x : 16);
      return ((targetLen > y) ? targetLen : y);
    }
  }
});
$p.nA = (function(array, curSize, targetSize) {
  var newLen = this.qJ(array.a.length, targetSize);
  if ((newLen < 0)) {
    return array;
  } else {
    var res = new $ac_O(newLen);
    array.t(0, res, 0, curSize);
    return res;
  }
});
$p.aa = (function(source) {
  return this.n4(source);
});
var $d_scm_ArrayBuffer$ = new $TypeData().i($c_scm_ArrayBuffer$, "scala.collection.mutable.ArrayBuffer$", ({
  gW: 1,
  a: 1,
  G: 1,
  Y: 1,
  al: 1
}));
var $n_scm_ArrayBuffer$;
function $m_scm_ArrayBuffer$() {
  if ((!$n_scm_ArrayBuffer$)) {
    $n_scm_ArrayBuffer$ = new $c_scm_ArrayBuffer$();
  }
  return $n_scm_ArrayBuffer$;
}
/** @constructor */
function $c_scm_ArrayBuffer$$anon$1() {
  this.ds = null;
  $ct_scm_GrowableBuilder__scm_Growable__(this, ($m_scm_ArrayBuffer$(), $ct_scm_ArrayBuffer__(new $c_scm_ArrayBuffer())));
}
$p = $c_scm_ArrayBuffer$$anon$1.prototype = new $h_scm_GrowableBuilder();
$p.constructor = $c_scm_ArrayBuffer$$anon$1;
/** @constructor */
function $h_scm_ArrayBuffer$$anon$1() {
}
$h_scm_ArrayBuffer$$anon$1.prototype = $p;
$p.b6 = (function(size) {
  this.ds.b6(size);
});
var $d_scm_ArrayBuffer$$anon$1 = new $TypeData().i($c_scm_ArrayBuffer$$anon$1, "scala.collection.mutable.ArrayBuffer$$anon$1", ({
  gX: 1,
  aX: 1,
  H: 1,
  J: 1,
  M: 1
}));
/** @constructor */
function $c_scm_Buffer$() {
  this.dX = null;
  $ct_sc_SeqFactory$Delegate__sc_SeqFactory__(this, $m_sjs_js_WrappedArray$());
}
$p = $c_scm_Buffer$.prototype = new $h_sc_SeqFactory$Delegate();
$p.constructor = $c_scm_Buffer$;
/** @constructor */
function $h_scm_Buffer$() {
}
$h_scm_Buffer$.prototype = $p;
var $d_scm_Buffer$ = new $TypeData().i($c_scm_Buffer$, "scala.collection.mutable.Buffer$", ({
  h3: 1,
  aO: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_scm_Buffer$;
function $m_scm_Buffer$() {
  if ((!$n_scm_Buffer$)) {
    $n_scm_Buffer$ = new $c_scm_Buffer$();
  }
  return $n_scm_Buffer$;
}
/** @constructor */
function $c_scm_HashSet$$anon$4(initialCapacity$1, loadFactor$1) {
  this.ds = null;
  $ct_scm_GrowableBuilder__scm_Growable__(this, $ct_scm_HashSet__I__D__(new $c_scm_HashSet(), initialCapacity$1, loadFactor$1));
}
$p = $c_scm_HashSet$$anon$4.prototype = new $h_scm_GrowableBuilder();
$p.constructor = $c_scm_HashSet$$anon$4;
/** @constructor */
function $h_scm_HashSet$$anon$4() {
}
$h_scm_HashSet$$anon$4.prototype = $p;
$p.b6 = (function(size) {
  this.ds.b6(size);
});
var $d_scm_HashSet$$anon$4 = new $TypeData().i($c_scm_HashSet$$anon$4, "scala.collection.mutable.HashSet$$anon$4", ({
  hd: 1,
  aX: 1,
  H: 1,
  J: 1,
  M: 1
}));
function $ct_scm_HashSet$HashSetIterator__scm_HashSet__($thiz, outer) {
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $thiz.fF = outer;
  $thiz.du = 0;
  $thiz.cL = null;
  $thiz.fG = outer.aQ.a.length;
  return $thiz;
}
/** @constructor */
function $c_scm_HashSet$HashSetIterator() {
  this.du = 0;
  this.cL = null;
  this.fG = 0;
  this.fF = null;
}
$p = $c_scm_HashSet$HashSetIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_scm_HashSet$HashSetIterator;
/** @constructor */
function $h_scm_HashSet$HashSetIterator() {
}
$h_scm_HashSet$HashSetIterator.prototype = $p;
$p.j = (function() {
  if ((this.cL !== null)) {
    return true;
  } else {
    while ((this.du < this.fG)) {
      var n = this.fF.aQ.a[this.du];
      this.du = ((1 + this.du) | 0);
      if ((n !== null)) {
        this.cL = n;
        return true;
      }
    }
    return false;
  }
});
$p.i = (function() {
  if ((!this.j())) {
    return $m_sc_Iterator$().P.i();
  } else {
    var x$proxy10 = this.cL;
    if ((x$proxy10 === null)) {
      $m_sr_Scala3RunTime$().cr();
    }
    var r = this.iS(x$proxy10);
    var x$proxy11 = this.cL;
    if ((x$proxy11 === null)) {
      $m_sr_Scala3RunTime$().cr();
    }
    this.cL = x$proxy11.aR;
    return r;
  }
});
function $ct_scm_ImmutableBuilder__sc_IterableOnce__($thiz, empty) {
  $thiz.fH = empty;
  return $thiz;
}
/** @constructor */
function $c_scm_ImmutableBuilder() {
  this.fH = null;
}
$p = $c_scm_ImmutableBuilder.prototype = new $h_O();
$p.constructor = $c_scm_ImmutableBuilder;
/** @constructor */
function $h_scm_ImmutableBuilder() {
}
$h_scm_ImmutableBuilder.prototype = $p;
$p.aT = (function(elems) {
  return $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, elems);
});
$p.b6 = (function(size) {
});
$p.aV = (function() {
  return this.fH;
});
/** @constructor */
function $c_scm_IndexedSeq$() {
  this.dX = null;
  $ct_sc_SeqFactory$Delegate__sc_SeqFactory__(this, $m_scm_ArrayBuffer$());
}
$p = $c_scm_IndexedSeq$.prototype = new $h_sc_SeqFactory$Delegate();
$p.constructor = $c_scm_IndexedSeq$;
/** @constructor */
function $h_scm_IndexedSeq$() {
}
$h_scm_IndexedSeq$.prototype = $p;
var $d_scm_IndexedSeq$ = new $TypeData().i($c_scm_IndexedSeq$, "scala.collection.mutable.IndexedSeq$", ({
  hg: 1,
  aO: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_scm_IndexedSeq$;
function $m_scm_IndexedSeq$() {
  if ((!$n_scm_IndexedSeq$)) {
    $n_scm_IndexedSeq$ = new $c_scm_IndexedSeq$();
  }
  return $n_scm_IndexedSeq$;
}
/** @constructor */
function $c_scm_ListBuffer$() {
}
$p = $c_scm_ListBuffer$.prototype = new $h_O();
$p.constructor = $c_scm_ListBuffer$;
/** @constructor */
function $h_scm_ListBuffer$() {
}
$h_scm_ListBuffer$.prototype = $p;
$p.cP = (function(elems) {
  return new $c_scm_ListBuffer().hb(elems);
});
$p.aH = (function() {
  return $ct_scm_GrowableBuilder__scm_Growable__(new $c_scm_GrowableBuilder(), new $c_scm_ListBuffer());
});
$p.aa = (function(source) {
  return new $c_scm_ListBuffer().hb(source);
});
var $d_scm_ListBuffer$ = new $TypeData().i($c_scm_ListBuffer$, "scala.collection.mutable.ListBuffer$", ({
  hj: 1,
  a: 1,
  G: 1,
  Y: 1,
  al: 1
}));
var $n_scm_ListBuffer$;
function $m_scm_ListBuffer$() {
  if ((!$n_scm_ListBuffer$)) {
    $n_scm_ListBuffer$ = new $c_scm_ListBuffer$();
  }
  return $n_scm_ListBuffer$;
}
/** @constructor */
function $c_scm_MutationTracker$CheckedIterator(underlying, mutationCount) {
  this.ix = null;
  this.mf = null;
  this.me = 0;
  this.ix = underlying;
  this.mf = mutationCount;
  this.me = (mutationCount.L() | 0);
}
$p = $c_scm_MutationTracker$CheckedIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_scm_MutationTracker$CheckedIterator;
/** @constructor */
function $h_scm_MutationTracker$CheckedIterator() {
}
$h_scm_MutationTracker$CheckedIterator.prototype = $p;
$p.j = (function() {
  $m_scm_MutationTracker$().mK(this.me, (this.mf.L() | 0), "mutation occurred during iteration");
  return this.ix.j();
});
$p.i = (function() {
  return this.ix.i();
});
var $d_scm_MutationTracker$CheckedIterator = new $TypeData().i($c_scm_MutationTracker$CheckedIterator, "scala.collection.mutable.MutationTracker$CheckedIterator", ({
  hl: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $f_s_reflect_ClassTag__equals__O__Z($thiz, x) {
  if ($is_s_reflect_ClassTag(x)) {
    var x$2 = $thiz.aI();
    var x$3 = x.aI();
    return ((x$2 === null) ? (x$3 === null) : (x$2 === x$3));
  } else {
    return false;
  }
}
function $p_s_reflect_ClassTag__prettyprint$1__jl_Class__T($thiz, clazz) {
  return (clazz.X.Z ? (("Array[" + $p_s_reflect_ClassTag__prettyprint$1__jl_Class__T($thiz, clazz.X.Q())) + "]") : clazz.X.N);
}
function $is_s_reflect_ClassTag(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.E)));
}
function $isArrayOf_s_reflect_ClassTag(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.E)));
}
/** @constructor */
function $c_sr_ScalaRunTime$$anon$1(x$1) {
  this.mk = null;
  this.fJ = 0;
  this.mj = 0;
  this.mk = x$1;
  this.fJ = 0;
  this.mj = x$1.b3();
}
$p = $c_sr_ScalaRunTime$$anon$1.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $h_sr_ScalaRunTime$$anon$1() {
}
$h_sr_ScalaRunTime$$anon$1.prototype = $p;
$p.j = (function() {
  return (this.fJ < this.mj);
});
$p.i = (function() {
  var result = this.mk.b4(this.fJ);
  this.fJ = ((1 + this.fJ) | 0);
  return result;
});
var $d_sr_ScalaRunTime$$anon$1 = new $TypeData().i($c_sr_ScalaRunTime$$anon$1, "scala.runtime.ScalaRunTime$$anon$1", ({
  i3: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sjs_js_WrappedArray$() {
}
$p = $c_sjs_js_WrappedArray$.prototype = new $h_O();
$p.constructor = $c_sjs_js_WrappedArray$;
/** @constructor */
function $h_sjs_js_WrappedArray$() {
}
$h_sjs_js_WrappedArray$.prototype = $p;
$p.cP = (function(elems) {
  return this.n5(elems);
});
$p.aH = (function() {
  return $ct_sjs_js_WrappedArray__(new $c_sjs_js_WrappedArray());
});
$p.n5 = (function(source) {
  return $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable($ct_sjs_js_WrappedArray__(new $c_sjs_js_WrappedArray()), source).aV();
});
$p.aa = (function(source) {
  return this.n5(source);
});
var $d_sjs_js_WrappedArray$ = new $TypeData().i($c_sjs_js_WrappedArray$, "scala.scalajs.js.WrappedArray$", ({
  i9: 1,
  al: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_sjs_js_WrappedArray$;
function $m_sjs_js_WrappedArray$() {
  if ((!$n_sjs_js_WrappedArray$)) {
    $n_sjs_js_WrappedArray$ = new $c_sjs_js_WrappedArray$();
  }
  return $n_sjs_js_WrappedArray$;
}
/** @constructor */
function $c_sjsr_WrappedVarArgs$() {
}
$p = $c_sjsr_WrappedVarArgs$.prototype = new $h_O();
$p.constructor = $c_sjsr_WrappedVarArgs$;
/** @constructor */
function $h_sjsr_WrappedVarArgs$() {
}
$h_sjsr_WrappedVarArgs$.prototype = $p;
$p.cP = (function(elems) {
  return this.iZ(elems);
});
$p.iZ = (function(source) {
  return this.aH().aT(source).aV();
});
$p.aH = (function() {
  return new $c_scm_Builder$$anon$1(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$1$2$2) => new $c_sjsr_WrappedVarArgs(x$1$2$2.dv))), $ct_sjs_js_WrappedArray__sjs_js_Array__(new $c_sjs_js_WrappedArray(), []));
});
$p.aa = (function(source) {
  return this.iZ(source);
});
var $d_sjsr_WrappedVarArgs$ = new $TypeData().i($c_sjsr_WrappedVarArgs$, "scala.scalajs.runtime.WrappedVarArgs$", ({
  io: 1,
  al: 1,
  a: 1,
  G: 1,
  Y: 1
}));
var $n_sjsr_WrappedVarArgs$;
function $m_sjsr_WrappedVarArgs$() {
  if ((!$n_sjsr_WrappedVarArgs$)) {
    $n_sjsr_WrappedVarArgs$ = new $c_sjsr_WrappedVarArgs$();
  }
  return $n_sjsr_WrappedVarArgs$;
}
/** @constructor */
function $c_s_util_Failure(exception) {
  this.dw = null;
  this.dw = exception;
}
$p = $c_s_util_Failure.prototype = new $h_s_util_Try();
$p.constructor = $c_s_util_Failure;
/** @constructor */
function $h_s_util_Failure() {
}
$h_s_util_Failure.prototype = $p;
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().eX(this, (-1408943127), true);
});
$p.l = (function(x$0) {
  if ((this === x$0)) {
    return true;
  } else if ((x$0 instanceof $c_s_util_Failure)) {
    var x = this.dw;
    var x$2 = x$0.dw;
    return ((x === null) ? (x$2 === null) : x.l(x$2));
  } else {
    return false;
  }
});
$p.p = (function() {
  return $m_sr_ScalaRunTime$().iA(this);
});
$p.b3 = (function() {
  return 1;
});
$p.b5 = (function() {
  return "Failure";
});
$p.b4 = (function(n) {
  if ((n === 0)) {
    return this.dw;
  }
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.ja = (function() {
  return true;
});
$p.nc = (function() {
  return false;
});
$p.y = (function() {
  var $x_1 = this.dw;
  throw (($x_1 instanceof $c_sjs_js_JavaScriptException) ? $x_1.Z : $x_1);
});
$p.je = (function(f) {
  return this;
});
$p.cR = (function(fa, fb) {
  return fa.b(this.dw);
});
function $isArrayOf_s_util_Failure(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ch)));
}
var $d_s_util_Failure = new $TypeData().i($c_s_util_Failure, "scala.util.Failure", ({
  ch: 1,
  cj: 1,
  d: 1,
  F: 1,
  a: 1
}));
/** @constructor */
function $c_s_util_Success(value) {
  this.dx = null;
  this.dx = value;
}
$p = $c_s_util_Success.prototype = new $h_s_util_Try();
$p.constructor = $c_s_util_Success;
/** @constructor */
function $h_s_util_Success() {
}
$h_s_util_Success.prototype = $p;
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().eX(this, (-1750213842), true);
});
$p.l = (function(x$0) {
  return ((this === x$0) || ((x$0 instanceof $c_s_util_Success) && $m_sr_BoxesRunTime$().k(this.dx, x$0.dx)));
});
$p.p = (function() {
  return $m_sr_ScalaRunTime$().iA(this);
});
$p.b3 = (function() {
  return 1;
});
$p.b5 = (function() {
  return "Success";
});
$p.b4 = (function(n) {
  if ((n === 0)) {
    return this.dx;
  }
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.ja = (function() {
  return false;
});
$p.nc = (function() {
  return true;
});
$p.y = (function() {
  return this.dx;
});
$p.je = (function(f) {
  try {
    return new $c_s_util_Success(f.b(this.dx));
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    var x2 = $m_s_util_control_NonFatal$().gb(e$2);
    if ((!x2.c())) {
      return new $c_s_util_Failure(x2.y());
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
$p.cR = (function(fa, fb) {
  try {
    return fb.b(this.dx);
  } catch (e) {
    var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
    var x42 = $m_s_util_control_NonFatal$().gb(e$2);
    if ((!x42.c())) {
      var x43 = x42.y();
      return fa.b(x43);
    }
    throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
  }
});
function $isArrayOf_s_util_Success(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ci)));
}
var $d_s_util_Success = new $TypeData().i($c_s_util_Success, "scala.util.Success", ({
  ci: 1,
  cj: 1,
  d: 1,
  F: 1,
  a: 1
}));
function $f_Lcom_raquo_airstream_combine_CombineObservable__onInputsReady__Lcom_raquo_airstream_core_Transaction__V($thiz, transaction) {
  if ((!transaction.oS($thiz))) {
    transaction.pa($thiz);
  }
}
function $f_Lcom_raquo_airstream_combine_CombineObservable__syncFire__Lcom_raquo_airstream_core_Transaction__V($thiz, transaction) {
  $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V($thiz, $thiz.iJ(), transaction);
}
function $f_Lcom_raquo_airstream_combine_CombineObservable__onStart__V($thiz) {
  var arr = $thiz.hh;
  var i = 0;
  var len = (arr.length | 0);
  while ((i < len)) {
    var _$1 = arr[i];
    $f_Lcom_raquo_airstream_core_WritableObservable__addInternalObserver__Lcom_raquo_airstream_core_InternalObserver__Z__V(_$1.hj, _$1, false);
    i = ((1 + i) | 0);
  }
  $f_Lcom_raquo_airstream_core_Signal__onStart__V($thiz);
}
function $f_Lcom_raquo_airstream_combine_CombineObservable__onStop__V($thiz) {
  var arr = $thiz.hh;
  var i = 0;
  var len = (arr.length | 0);
  while ((i < len)) {
    var _$2 = arr[i];
    $f_Lcom_raquo_airstream_core_BaseObservable__removeInternalObserver__Lcom_raquo_airstream_core_InternalObserver__V(_$2.hj, _$2);
    i = ((1 + i) | 0);
  }
}
class $c_Lcom_raquo_airstream_core_AirstreamError$CombinedError extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(causes) {
    super();
    this.f4 = null;
    this.f4 = causes;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, $m_Lcom_raquo_airstream_core_AirstreamError$().oN(causes), null, true, true);
    var this$2 = causes.eb($m_s_$less$colon$less$().ex).bA();
    if ((!this$2.c())) {
      this.h0(this$2.y());
    }
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().fV(this, (-889275714), null);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$CombinedError)) {
      var x = this.f4;
      var x$2 = x$0.f4;
      return ((x === null) ? (x$2 === null) : x.l(x$2));
    } else {
      return false;
    }
  }
  b3() {
    return 1;
  }
  b5() {
    return "CombinedError";
  }
  b4(n) {
    if ((n === 0)) {
      return this.f4;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ("CombinedError: " + $f_sc_IterableOnceOps__mkString__T__T__T__T(this.f4.eb($m_s_$less$colon$less$().ex).ei(), "", "; ", ""));
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$CombinedError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b1)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$CombinedError = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$CombinedError, "com.raquo.airstream.core.AirstreamError$CombinedError", ({
  b1: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
class $c_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(error, cause) {
    super();
    this.f6 = null;
    this.f5 = null;
    this.f6 = error;
    this.f5 = cause;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, ((("ErrorHandlingError: " + $m_Lcom_raquo_airstream_core_AirstreamError$().dH(error)) + "; cause: ") + $m_Lcom_raquo_airstream_core_AirstreamError$().dH(cause)), null, true, true);
    this.h0(cause);
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().fV(this, (-889275714), null);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError)) {
      var x = this.f6;
      var x$2 = x$0.f6;
      if (((x === null) ? (x$2 === null) : x.l(x$2))) {
        var x$3 = this.f5;
        var x$4 = x$0.f5;
        return ((x$3 === null) ? (x$4 === null) : x$3.l(x$4));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  b3() {
    return 2;
  }
  b5() {
    return "ErrorHandlingError";
  }
  b4(n) {
    if ((n === 0)) {
      return this.f6;
    }
    if ((n === 1)) {
      return this.f5;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ((("ErrorHandlingError: " + this.f6) + "; cause: ") + this.f5);
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b2)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError, "com.raquo.airstream.core.AirstreamError$ErrorHandlingError", ({
  b2: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
class $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(error) {
    super();
    this.f7 = null;
    this.f7 = error;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, ("ObserverError: " + $m_Lcom_raquo_airstream_core_AirstreamError$().dH(error)), null, true, true);
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().fV(this, (-889275714), null);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$ObserverError)) {
      var x = this.f7;
      var x$2 = x$0.f7;
      return ((x === null) ? (x$2 === null) : x.l(x$2));
    } else {
      return false;
    }
  }
  b3() {
    return 1;
  }
  b5() {
    return "ObserverError";
  }
  b4(n) {
    if ((n === 0)) {
      return this.f7;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ("ObserverError: " + this.f7);
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$ObserverError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b3)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$ObserverError = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$ObserverError, "com.raquo.airstream.core.AirstreamError$ObserverError", ({
  b3: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
class $c_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(error, cause) {
    super();
    this.f9 = null;
    this.f8 = null;
    this.f9 = error;
    this.f8 = cause;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, ((("ObserverErrorHandlingError: " + $m_Lcom_raquo_airstream_core_AirstreamError$().dH(error)) + "; cause: ") + $m_Lcom_raquo_airstream_core_AirstreamError$().dH(cause)), null, true, true);
    this.h0(cause);
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().fV(this, (-889275714), null);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError)) {
      var x = this.f9;
      var x$2 = x$0.f9;
      if (((x === null) ? (x$2 === null) : x.l(x$2))) {
        var x$3 = this.f8;
        var x$4 = x$0.f8;
        return ((x$3 === null) ? (x$4 === null) : x$3.l(x$4));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  b3() {
    return 2;
  }
  b5() {
    return "ObserverErrorHandlingError";
  }
  b4(n) {
    if ((n === 0)) {
      return this.f9;
    }
    if ((n === 1)) {
      return this.f8;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ((("ObserverErrorHandlingError: " + this.f9) + "; cause: ") + this.f8);
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b4)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$ObserverErrorHandlingError, "com.raquo.airstream.core.AirstreamError$ObserverErrorHandlingError", ({
  b4: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
class $c_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(trx, depth) {
    super();
    this.em = null;
    this.el = 0;
    this.em = trx;
    this.el = depth;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, (((("Transaction depth exceeded maxDepth = " + depth) + ": Execution of ") + trx) + " aborted. See `Transaction.maxDepth`."), null, true, true);
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    var acc = (-889275714);
    acc = $m_sr_Statics$().v(acc, $f_T__hashCode__I("TransactionDepthExceeded"));
    acc = $m_sr_Statics$().v(acc, $m_sr_Statics$().H(this.em));
    acc = $m_sr_Statics$().v(acc, this.el);
    return $m_sr_Statics$().ay(acc, 2);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded)) {
      if ((this.el === x$0.el)) {
        var x = this.em;
        var x$2 = x$0.em;
        return ((x === null) ? (x$2 === null) : (x === x$2));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  b3() {
    return 2;
  }
  b5() {
    return "TransactionDepthExceeded";
  }
  b4(n) {
    if ((n === 0)) {
      return this.em;
    }
    if ((n === 1)) {
      return this.el;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ((("TransactionDepthExceeded: " + this.em) + "; maxDepth: ") + this.el);
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b5)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$TransactionDepthExceeded, "com.raquo.airstream.core.AirstreamError$TransactionDepthExceeded", ({
  b5: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
class $c_Lcom_raquo_airstream_core_AirstreamError$VarError extends $c_Lcom_raquo_airstream_core_AirstreamError {
  constructor(message, cause) {
    super();
    this.fb = null;
    this.fa = null;
    this.fb = message;
    this.fa = cause;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, $m_Lcom_raquo_airstream_core_AirstreamError$().oO(message, cause), null, true, true);
    if ((!cause.c())) {
      this.h0(cause.y());
    }
  }
  bJ() {
    return new $c_s_Product$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().fV(this, (-889275714), null);
  }
  l(x$0) {
    if ((this === x$0)) {
      return true;
    } else if ((x$0 instanceof $c_Lcom_raquo_airstream_core_AirstreamError$VarError)) {
      if ((this.fb === x$0.fb)) {
        var x = this.fa;
        var x$2 = x$0.fa;
        return ((x === null) ? (x$2 === null) : x.l(x$2));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  b3() {
    return 2;
  }
  b5() {
    return "VarError";
  }
  b4(n) {
    if ((n === 0)) {
      return this.fb;
    }
    if ((n === 1)) {
      return this.fa;
    }
    throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
  }
  p() {
    return ((("VarError: " + this.fb) + "; cause: ") + this.fa);
  }
}
function $isArrayOf_Lcom_raquo_airstream_core_AirstreamError$VarError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.b6)));
}
var $d_Lcom_raquo_airstream_core_AirstreamError$VarError = new $TypeData().i($c_Lcom_raquo_airstream_core_AirstreamError$VarError, "com.raquo.airstream.core.AirstreamError$VarError", ({
  b6: 1,
  af: 1,
  n: 1,
  a: 1,
  d: 1,
  F: 1
}));
function $f_Lcom_raquo_airstream_core_Signal__onStart__V($thiz) {
  $thiz.eZ();
}
var $d_Lcom_raquo_airstream_core_Signal = new $TypeData().i(1, "com.raquo.airstream.core.Signal", ({
  aw: 1,
  ap: 1,
  a4: 1,
  at: 1,
  au: 1,
  aq: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_state_SourceVar(initial) {
  this.k4 = null;
  this.hz = null;
  this.hy = null;
  this.hx = null;
  this.cf = null;
  this.k4 = (void 0);
  $f_Lcom_raquo_airstream_state_Var__$init$__V(this);
  this.hy = initial;
  this.hx = new $c_Lcom_raquo_airstream_state_VarSignal(this.hy, new $c_sjsr_AnonFunction0_$$Lambda$2bf0f8dc580d6edeb2d6a336c52a1bab3049702d((() => $f_Lcom_raquo_airstream_core_Named__displayName__T(this))));
  this.cf = this.hx;
}
$p = $c_Lcom_raquo_airstream_state_SourceVar.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_state_SourceVar;
/** @constructor */
function $h_Lcom_raquo_airstream_state_SourceVar() {
}
$h_Lcom_raquo_airstream_state_SourceVar.prototype = $p;
$p.eg = (function() {
  return this.k4;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.cd = (function() {
  return this.cf;
});
$p.nC = (function(value, transaction) {
  this.hy = value;
  $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V(this.hx, value, transaction);
});
var $d_Lcom_raquo_airstream_state_SourceVar = new $TypeData().i($c_Lcom_raquo_airstream_state_SourceVar, "com.raquo.airstream.state.SourceVar", ({
  cW: 1,
  ap: 1,
  aq: 1,
  ao: 1,
  a4: 1,
  cY: 1
}));
function $p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__appendValueController__Lcom_raquo_laminar_inputs_InputController__V($thiz, controller) {
  var x = $thiz.fl;
  if ((x === (void 0))) {
    $thiz.fl = $m_sjs_js_defined$().mG($m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_Lcom_raquo_laminar_inputs_InputController.r().C)([controller]))));
  } else {
    (x.push(controller) | 0);
  }
}
function $p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__appendControllablePropBinder__T__V($thiz, propDomName) {
  var x = $thiz.gr;
  if ((x === (void 0))) {
    $thiz.gr = $m_sjs_js_defined$().mG($m_Lcom_raquo_ew_JsArray$().aF($m_sr_ScalaRunTime$().aA(new ($d_T.r().C)([propDomName]))));
  } else {
    (x.push(propDomName) | 0);
  }
}
function $p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__hasController__T__Z($thiz, propDomName) {
  var x = $thiz.fl;
  if ((x !== (void 0))) {
    _return: {
      var len = (x.length | 0);
      var i = 0;
      while ((i < len)) {
        if ((x[i].bm() === propDomName)) {
          var $x_1 = i;
          break _return;
        }
        i = ((1 + i) | 0);
      }
      var $x_1 = (-1);
    }
    return ($x_1 >= 0);
  } else {
    return false;
  }
}
/** @constructor */
function $c_Lcom_raquo_laminar_nodes_ReactiveHtmlElement(tag, ref) {
  this.fj = null;
  this.bK = null;
  this.hX = null;
  this.cv = null;
  this.fk = null;
  this.fm = null;
  this.I = null;
  this.fl = null;
  this.gr = null;
  this.fm = tag;
  this.I = ref;
  this.fj = $m_s_None$();
  $f_Lcom_raquo_laminar_nodes_ParentNode__$init$__V(this);
  $f_Lcom_raquo_laminar_nodes_ReactiveElement__$init$__V(this);
  this.fl = (void 0);
  this.gr = (void 0);
}
$p = $c_Lcom_raquo_laminar_nodes_ReactiveHtmlElement.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_nodes_ReactiveHtmlElement;
/** @constructor */
function $h_Lcom_raquo_laminar_nodes_ReactiveHtmlElement() {
}
$h_Lcom_raquo_laminar_nodes_ReactiveHtmlElement.prototype = $p;
$p.iI = (function() {
  return this.fj;
});
$p.bV = (function(parentNode) {
  $m_Lcom_raquo_laminar_nodes_ParentNode$().fK(parentNode, this, (void 0));
});
$p.gX = (function() {
  return this.bK;
});
$p.mM = (function(x$0) {
  this.bK = x$0;
});
$p.ek = (function(maybeNextParent) {
  $f_Lcom_raquo_laminar_nodes_ReactiveElement__willSetParent__s_Option__V(this, maybeNextParent);
});
$p.eh = (function(maybeNextParent) {
  $f_Lcom_raquo_laminar_nodes_ReactiveElement__setParent__s_Option__V(this, maybeNextParent);
});
$p.pH = (function(domPropName) {
  var x = this.gr;
  return ((x !== (void 0)) && $m_Lcom_raquo_ew_JsArray$RichJsArray$().j6(x, domPropName, 0));
});
$p.pI = (function(thisController) {
  var x = this.fl;
  if ((x !== (void 0))) {
    _return: {
      var len = (x.length | 0);
      var i = 0;
      while ((i < len)) {
        var x0 = x[i];
        if (((x0.bm() === thisController.bm()) && (!((x0 === null) ? (thisController === null) : (x0 === thisController))))) {
          var $x_1 = i;
          break _return;
        }
        i = ((1 + i) | 0);
      }
      var $x_1 = (-1);
    }
    return ($x_1 >= 0);
  } else {
    return false;
  }
});
$p.oF = (function(controller) {
  var dynSub = controller.oE();
  $p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__appendValueController__Lcom_raquo_laminar_inputs_InputController__V(this, controller);
  return dynSub;
});
$p.mN = (function() {
  if ($m_Lcom_raquo_laminar_DomApi$().ed(this.I)) {
    var x1 = this.fm;
    if (false) {
      return x1.rj();
    }
    return (void 0);
  } else {
    return $m_Lcom_raquo_laminar_inputs_InputController$().kW;
  }
});
$p.pW = (function(propDomName) {
  var x = this.mN();
  return ((x !== (void 0)) && $m_Lcom_raquo_ew_JsArray$RichJsArray$().j6(x, propDomName, 0));
});
$p.qq = (function(key) {
  if ((key instanceof $c_Lcom_raquo_laminar_keys_HtmlProp)) {
    if (this.pW(key.bn)) {
      if ($p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__hasController__T__Z(this, key.bn)) {
        throw $ct_jl_Exception__T__(new $c_jl_Exception(), (((((("Can not add uncontrolled `" + key.bn) + " <-- ???` to element `") + $m_Lcom_raquo_laminar_DomApi$().iM(this.I)) + "` that already has an input controller for `") + key.bn) + "` property."));
      } else {
        $p_Lcom_raquo_laminar_nodes_ReactiveHtmlElement__appendControllablePropBinder__T__V(this, key.bn);
      }
    }
  }
});
$p.p = (function() {
  return (("ReactiveHtmlElement(" + ((this.I !== null) ? this.I.outerHTML : ("tag=" + this.fm.i0))) + ")");
});
$p.ao = (function() {
  return this.I;
});
var $d_Lcom_raquo_laminar_nodes_ReactiveHtmlElement = new $TypeData().i($c_Lcom_raquo_laminar_nodes_ReactiveHtmlElement, "com.raquo.laminar.nodes.ReactiveHtmlElement", ({
  eg: 1,
  ax: 1,
  W: 1,
  aH: 1,
  bd: 1,
  ee: 1
}));
function $ct_jl_ArrayIndexOutOfBoundsException__T__($thiz, s) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, s, null, true, true);
  return $thiz;
}
function $ct_jl_ArrayIndexOutOfBoundsException__($thiz) {
  $ct_jl_Throwable__T__jl_Throwable__Z__Z__($thiz, null, null, true, true);
  return $thiz;
}
class $c_jl_ArrayIndexOutOfBoundsException extends $c_jl_IndexOutOfBoundsException {
}
var $d_jl_ArrayIndexOutOfBoundsException = new $TypeData().i($c_jl_ArrayIndexOutOfBoundsException, "java.lang.ArrayIndexOutOfBoundsException", ({
  eu: 1,
  bj: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $f_jl_Double__equals__O__Z($thiz, that) {
  return Object.is($thiz, that);
}
function $f_jl_Double__hashCode__I($thiz) {
  var valueInt = ($thiz | 0);
  if (((valueInt === $thiz) && ((1.0 / $thiz) !== (-Infinity)))) {
    return valueInt;
  } else if (($thiz !== $thiz)) {
    return 2146959360;
  } else {
    var fpBitsDataView = $fpBitsDataView;
    fpBitsDataView.setFloat64(0, $thiz, true);
    return ((fpBitsDataView.getInt32(0, true) | 0) ^ (fpBitsDataView.getInt32(4, true) | 0));
  }
}
function $f_jl_Double__toString__T($thiz) {
  return ("" + $thiz);
}
function $isArrayOf_jl_Double(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bh)));
}
var $d_jl_Double = new $TypeData().i(0, "java.lang.Double", ({
  bh: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1,
  ar: 1
}), ((x) => ((typeof x) === "number")));
function $f_jl_Float__equals__O__Z($thiz, that) {
  return Object.is($thiz, that);
}
function $f_jl_Float__hashCode__I($thiz) {
  var value = $thiz;
  var valueInt = (value | 0);
  if (((valueInt === value) && ((1.0 / value) !== (-Infinity)))) {
    return valueInt;
  } else if ((value !== value)) {
    return 2146959360;
  } else {
    var fpBitsDataView = $fpBitsDataView;
    fpBitsDataView.setFloat64(0, value, true);
    return ((fpBitsDataView.getInt32(0, true) | 0) ^ (fpBitsDataView.getInt32(4, true) | 0));
  }
}
function $f_jl_Float__toString__T($thiz) {
  return ("" + $thiz);
}
var $d_jl_Float = new $TypeData().i(0, "java.lang.Float", ({
  eC: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1,
  ar: 1
}), ((x) => $isFloat(x)));
function $f_jl_Integer__equals__O__Z($thiz, that) {
  return Object.is($thiz, that);
}
function $f_jl_Integer__hashCode__I($thiz) {
  return $thiz;
}
function $f_jl_Integer__toString__T($thiz) {
  return ("" + $thiz);
}
function $isArrayOf_jl_Integer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bk)));
}
var $d_jl_Integer = new $TypeData().i(0, "java.lang.Integer", ({
  bk: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1,
  ar: 1
}), ((x) => $isInt(x)));
function $f_jl_Long__equals__O__Z($thiz, $thizhi, that) {
  if ((that instanceof $Long)) {
    var $x_1 = that;
    var this$1_$_lo = $x_1.l;
    var this$1_$_hi = $x_1.h;
    return ((($thiz ^ this$1_$_lo) | ($thizhi ^ this$1_$_hi)) === 0);
  } else {
    return false;
  }
}
function $f_jl_Long__hashCode__I($thiz, $thizhi) {
  return ($thiz ^ $thizhi);
}
function $f_jl_Long__toString__T($thiz, $thizhi) {
  return $m_RTLong$().js($thiz, $thizhi);
}
function $isArrayOf_jl_Long(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bl)));
}
var $d_jl_Long = new $TypeData().i(0, "java.lang.Long", ({
  bl: 1,
  ac: 1,
  a: 1,
  a5: 1,
  a2: 1,
  ar: 1
}), ((x) => (x instanceof $Long)));
class $c_jl_NumberFormatException extends $c_jl_IllegalArgumentException {
  constructor(s) {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, s, null, true, true);
  }
}
var $d_jl_NumberFormatException = new $TypeData().i($c_jl_NumberFormatException, "java.lang.NumberFormatException", ({
  eI: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $f_T__hashCode__I($thiz) {
  var n = $thiz.length;
  var h = 0;
  var i = 0;
  while ((i !== n)) {
    h = (((((h << 5) - h) | 0) + $thiz.charCodeAt(i)) | 0);
    i = ((1 + i) | 0);
  }
  return h;
}
function $f_T__equals__O__Z($thiz, that) {
  return ($thiz === that);
}
function $f_T__indexOf__I__I($thiz, ch) {
  var str = $m_jl_Character$().jt(ch);
  return ($thiz.indexOf(str) | 0);
}
function $f_T__toString__T($thiz) {
  return $thiz;
}
function $isArrayOf_T(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bn)));
}
var $d_T = new $TypeData().i(0, "java.lang.String", ({
  bn: 1,
  a: 1,
  a5: 1,
  aI: 1,
  a2: 1,
  ar: 1
}), ((x) => ((typeof x) === "string")));
class $c_ju_FormatterClosedException extends $c_jl_IllegalStateException {
  constructor() {
    super();
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
}
var $d_ju_FormatterClosedException = new $TypeData().i($c_ju_FormatterClosedException, "java.util.FormatterClosedException", ({
  f6: 1,
  bi: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatException extends $c_jl_IllegalArgumentException {
}
/** @constructor */
function $c_s_None$() {
}
$p = $c_s_None$.prototype = new $h_s_Option();
$p.constructor = $c_s_None$;
/** @constructor */
function $h_s_None$() {
}
$h_s_None$.prototype = $p;
$p.r = (function() {
  return 2433880;
});
$p.p = (function() {
  return "None";
});
$p.b3 = (function() {
  return 0;
});
$p.b5 = (function() {
  return "None";
});
$p.b4 = (function(n) {
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.py = (function() {
  throw new $c_ju_NoSuchElementException("None.get");
});
$p.y = (function() {
  this.py();
});
var $d_s_None$ = new $TypeData().i($c_s_None$, "scala.None$", ({
  fw: 1,
  bq: 1,
  b: 1,
  d: 1,
  F: 1,
  a: 1
}));
var $n_s_None$;
function $m_s_None$() {
  if ((!$n_s_None$)) {
    $n_s_None$ = new $c_s_None$();
  }
  return $n_s_None$;
}
/** @constructor */
function $c_s_Some(value) {
  this.ez = null;
  this.ez = value;
}
$p = $c_s_Some.prototype = new $h_s_Option();
$p.constructor = $c_s_Some;
/** @constructor */
function $h_s_Some() {
}
$h_s_Some.prototype = $p;
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().eX(this, 1323286827, true);
});
$p.l = (function(x$0) {
  return ((this === x$0) || ((x$0 instanceof $c_s_Some) && $m_sr_BoxesRunTime$().k(this.ez, x$0.ez)));
});
$p.p = (function() {
  return $m_sr_ScalaRunTime$().iA(this);
});
$p.b3 = (function() {
  return 1;
});
$p.b5 = (function() {
  return "Some";
});
$p.b4 = (function(n) {
  if ((n === 0)) {
    return this.ez;
  }
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.y = (function() {
  return this.ez;
});
function $isArrayOf_s_Some(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.br)));
}
var $d_s_Some = new $TypeData().i($c_s_Some, "scala.Some", ({
  br: 1,
  bq: 1,
  b: 1,
  d: 1,
  F: 1,
  a: 1
}));
/** @constructor */
function $c_sc_AbstractIterable() {
}
$p = $c_sc_AbstractIterable.prototype = new $h_O();
$p.constructor = $c_sc_AbstractIterable;
/** @constructor */
function $h_sc_AbstractIterable() {
}
$h_sc_AbstractIterable.prototype = $p;
$p.u = (function() {
  return (-1);
});
$p.bz = (function(f) {
  $f_sc_IterableOnceOps__foreach__F1__V(this, f);
});
$p.eR = (function(p) {
  return $f_sc_IterableOnceOps__forall__F1__Z(this, p);
});
$p.c = (function() {
  return $f_sc_IterableOnceOps__isEmpty__Z(this);
});
$p.by = (function(dest, start, n) {
  return $f_sc_IterableOnceOps__copyToArray__O__I__I__I(this, dest, start, n);
});
$p.dz = (function(b, start, sep, end) {
  return $f_sc_IterableOnceOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end);
});
$p.ei = (function() {
  $m_sci_List$();
  return $m_sci_Nil$().eW(this);
});
$p.bA = (function() {
  return $f_sc_IterableOps__headOption__s_Option(this);
});
$p.K = (function(f) {
  return $f_sc_IterableOps__map__F1__O(this, f);
});
$p.g1 = (function(coll) {
  return this.b1().aa(coll);
});
$p.g6 = (function() {
  return this.b1().aH();
});
$p.bH = (function() {
  return this.bb();
});
$p.g0 = (function(coll) {
  return this.g1(coll);
});
/** @constructor */
function $c_sc_ArrayOps$ArrayIterator(xs) {
  this.gw = null;
  this.cy = 0;
  this.fp = 0;
  this.gw = xs;
  this.cy = 0;
  this.fp = $m_jl_reflect_Array$().bI(this.gw);
}
$p = $c_sc_ArrayOps$ArrayIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_ArrayOps$ArrayIterator;
/** @constructor */
function $h_sc_ArrayOps$ArrayIterator() {
}
$h_sc_ArrayOps$ArrayIterator.prototype = $p;
$p.u = (function() {
  return ((this.fp - this.cy) | 0);
});
$p.j = (function() {
  return (this.cy < this.fp);
});
$p.i = (function() {
  if ((this.cy >= $m_jl_reflect_Array$().bI(this.gw))) {
    $m_sc_Iterator$().P.i();
  }
  var r = $m_sr_ScalaRunTime$().e9(this.gw, this.cy);
  this.cy = ((1 + this.cy) | 0);
  return r;
});
$p.dF = (function(n) {
  if ((n > 0)) {
    var newPos = ((this.cy + n) | 0);
    if ((newPos < 0)) {
      var $x_1 = this.fp;
    } else {
      var a = this.fp;
      var $x_1 = ((a < newPos) ? a : newPos);
    }
    this.cy = $x_1;
  }
  return this;
});
var $d_sc_ArrayOps$ArrayIterator = new $TypeData().i($c_sc_ArrayOps$ArrayIterator, "scala.collection.ArrayOps$ArrayIterator", ({
  fG: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1,
  a: 1
}));
function $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__($thiz, self) {
  $thiz.ib = self;
  $thiz.cz = 0;
  $thiz.bc = self.m();
  return $thiz;
}
function $p_sc_IndexedSeqView$IndexedSeqViewIterator__formatRange$1__I__I($thiz, value) {
  return ((value < 0) ? 0 : ((value > $thiz.bc) ? $thiz.bc : value));
}
/** @constructor */
function $c_sc_IndexedSeqView$IndexedSeqViewIterator() {
  this.ib = null;
  this.cz = 0;
  this.bc = 0;
}
$p = $c_sc_IndexedSeqView$IndexedSeqViewIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sc_IndexedSeqView$IndexedSeqViewIterator;
/** @constructor */
function $h_sc_IndexedSeqView$IndexedSeqViewIterator() {
}
$h_sc_IndexedSeqView$IndexedSeqViewIterator.prototype = $p;
$p.u = (function() {
  return this.bc;
});
$p.j = (function() {
  return (this.bc > 0);
});
$p.i = (function() {
  if ((this.bc > 0)) {
    var r = this.ib.q(this.cz);
    this.cz = ((1 + this.cz) | 0);
    this.bc = ((this.bc - 1) | 0);
    return r;
  } else {
    return $m_sc_Iterator$().P.i();
  }
});
$p.dF = (function(n) {
  if ((n > 0)) {
    this.cz = ((this.cz + n) | 0);
    var b = ((this.bc - n) | 0);
    this.bc = ((b < 0) ? 0 : b);
  }
  return this;
});
$p.ga = (function(from, until) {
  var formatFrom = $p_sc_IndexedSeqView$IndexedSeqViewIterator__formatRange$1__I__I(this, from);
  var formatUntil = $p_sc_IndexedSeqView$IndexedSeqViewIterator__formatRange$1__I__I(this, until);
  var b = ((formatUntil - formatFrom) | 0);
  this.bc = ((b < 0) ? 0 : b);
  this.cz = ((this.cz + formatFrom) | 0);
  return this;
});
var $d_sc_IndexedSeqView$IndexedSeqViewIterator = new $TypeData().i($c_sc_IndexedSeqView$IndexedSeqViewIterator, "scala.collection.IndexedSeqView$IndexedSeqViewIterator", ({
  bx: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1,
  a: 1
}));
/** @constructor */
function $c_sc_Iterator$$anon$21() {
  this.fH = null;
  $ct_scm_ImmutableBuilder__sc_IterableOnce__(this, $m_sc_Iterator$().P);
}
$p = $c_sc_Iterator$$anon$21.prototype = new $h_scm_ImmutableBuilder();
$p.constructor = $c_sc_Iterator$$anon$21;
/** @constructor */
function $h_sc_Iterator$$anon$21() {
}
$h_sc_Iterator$$anon$21.prototype = $p;
$p.om = (function(elem) {
  this.fH = this.fH.iK(new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => new $c_sc_Iterator$$anon$20(elem))));
  return this;
});
$p.aU = (function(elem) {
  return this.om(elem);
});
var $d_sc_Iterator$$anon$21 = new $TypeData().i($c_sc_Iterator$$anon$21, "scala.collection.Iterator$$anon$21", ({
  fP: 1,
  hf: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1
}));
function $f_sc_MapOps__applyOrElse__O__F1__O($thiz, x, default$1) {
  return $thiz.cT(x, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => default$1.b(x))));
}
function $f_sc_MapOps__foreachEntry__F2__V($thiz, f) {
  var it = $thiz.h();
  while (it.j()) {
    var next = it.i();
    f.dB(next.b8, next.aW);
  }
}
function $f_sc_MapOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder($thiz, sb, start, sep, end) {
  return $f_sc_IterableOnceOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(new $c_sc_Iterator$$anon$9(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$1$2) => {
    var k = x$1$2.b8;
    var v = x$1$2.aW;
    return ((k + " -> ") + v);
  })), $thiz.h()), sb, start, sep, end);
}
function $f_sc_StrictOptimizedSeqOps__distinctBy__F1__O($thiz, f) {
  var builder = $thiz.g6();
  var seen = $ct_scm_HashSet__(new $c_scm_HashSet());
  var it = $thiz.h();
  while (it.j()) {
    var next = it.i();
    if (seen.gQ(f.b(next))) {
      builder.aU(next);
    }
  }
  return builder.aV();
}
function $f_sc_StrictOptimizedSeqOps__appendedAll__sc_IterableOnce__O($thiz, suffix) {
  var b = $thiz.dJ().aH();
  b.aT($thiz);
  b.aT(suffix);
  return b.aV();
}
function $p_sci_ArraySeq$__emptyImpl__sci_ArraySeq$ofRef($thiz) {
  if ((!$thiz.lX)) {
    $thiz.lW = new $c_sci_ArraySeq$ofRef(new ($d_sr_Nothing$.r().C)(0));
    $thiz.lX = true;
  }
  return $thiz.lW;
}
/** @constructor */
function $c_sci_ArraySeq$() {
  this.ie = null;
  this.lW = null;
  this.lX = false;
  $n_sci_ArraySeq$ = this;
  this.ie = new $c_sc_ClassTagSeqFactory$AnySeqDelegate(this);
}
$p = $c_sci_ArraySeq$.prototype = new $h_O();
$p.constructor = $c_sci_ArraySeq$;
/** @constructor */
function $h_sci_ArraySeq$() {
}
$h_sci_ArraySeq$.prototype = $p;
$p.iV = (function(it, tag) {
  return ((it instanceof $c_sci_ArraySeq) ? it : this.hd($m_s_Array$().n2(it, tag)));
});
$p.h6 = (function(evidence$1) {
  return new $c_scm_Builder$$anon$1(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((b$2) => this.hd($f_sc_IterableOnceOps__toArray__s_reflect_ClassTag__O(b$2, evidence$1)))), ($m_scm_ArrayBuffer$(), new $c_scm_ArrayBuffer$$anon$1()));
});
$p.hd = (function(x) {
  if ((x === null)) {
    return null;
  }
  if ((x instanceof $ac_O)) {
    return new $c_sci_ArraySeq$ofRef(x);
  }
  if ((x instanceof $ac_I)) {
    return new $c_sci_ArraySeq$ofInt(x);
  }
  if ((x instanceof $ac_D)) {
    return new $c_sci_ArraySeq$ofDouble(x);
  }
  if ((x instanceof $ac_J)) {
    return new $c_sci_ArraySeq$ofLong(x);
  }
  if ((x instanceof $ac_F)) {
    return new $c_sci_ArraySeq$ofFloat(x);
  }
  if ((x instanceof $ac_C)) {
    return new $c_sci_ArraySeq$ofChar(x);
  }
  if ((x instanceof $ac_B)) {
    return new $c_sci_ArraySeq$ofByte(x);
  }
  if ((x instanceof $ac_S)) {
    return new $c_sci_ArraySeq$ofShort(x);
  }
  if ((x instanceof $ac_Z)) {
    return new $c_sci_ArraySeq$ofBoolean(x);
  }
  if ($isArrayOf_jl_Void(x, 1)) {
    return new $c_sci_ArraySeq$ofUnit(x);
  }
  throw new $c_s_MatchError(x);
});
$p.iU = (function(it, evidence$1) {
  return this.iV(it, evidence$1);
});
var $d_sci_ArraySeq$ = new $TypeData().i($c_sci_ArraySeq$, "scala.collection.immutable.ArraySeq$", ({
  g6: 1,
  a: 1,
  bw: 1,
  bu: 1,
  bv: 1,
  bB: 1
}));
var $n_sci_ArraySeq$;
function $m_sci_ArraySeq$() {
  if ((!$n_sci_ArraySeq$)) {
    $n_sci_ArraySeq$ = new $c_sci_ArraySeq$();
  }
  return $n_sci_ArraySeq$;
}
/** @constructor */
function $c_sci_HashMapBuilder$$anon$1(hm$1, outer) {
  this.bE = 0;
  this.fw = 0;
  this.e1 = null;
  this.bq = 0;
  this.cC = null;
  this.fx = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_sci_ChampBaseIterator__sci_Node__(this, hm$1.bh);
  while (this.j()) {
    var originalHash = this.e1.g2(this.bE);
    outer.f1(outer.cj, this.e1.dI(this.bE), this.e1.cU(this.bE), originalHash, $m_sc_Hashing$().c8(originalHash), 0);
    this.bE = ((1 + this.bE) | 0);
  }
}
$p = $c_sci_HashMapBuilder$$anon$1.prototype = new $h_sci_ChampBaseIterator();
$p.constructor = $c_sci_HashMapBuilder$$anon$1;
/** @constructor */
function $h_sci_HashMapBuilder$$anon$1() {
}
$h_sci_HashMapBuilder$$anon$1.prototype = $p;
$p.i = (function() {
  return $m_sc_Iterator$().P.i();
});
var $d_sci_HashMapBuilder$$anon$1 = new $TypeData().i($c_sci_HashMapBuilder$$anon$1, "scala.collection.immutable.HashMapBuilder$$anon$1", ({
  ga: 1,
  bO: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $is_sci_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.s)));
}
function $isArrayOf_sci_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.s)));
}
/** @constructor */
function $c_sci_Map$Map2$$anon$1(outer) {
  this.dg = 0;
  this.eG = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_sci_Map$Map2$Map2Iterator__sci_Map$Map2__(this, outer);
}
$p = $c_sci_Map$Map2$$anon$1.prototype = new $h_sci_Map$Map2$Map2Iterator();
$p.constructor = $c_sci_Map$Map2$$anon$1;
/** @constructor */
function $h_sci_Map$Map2$$anon$1() {
}
$h_sci_Map$Map2$$anon$1.prototype = $p;
var $d_sci_Map$Map2$$anon$1 = new $TypeData().i($c_sci_Map$Map2$$anon$1, "scala.collection.immutable.Map$Map2$$anon$1", ({
  gq: 1,
  gr: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sci_Map$Map3$$anon$4(outer) {
  this.di = 0;
  this.dh = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_sci_Map$Map3$Map3Iterator__sci_Map$Map3__(this, outer);
}
$p = $c_sci_Map$Map3$$anon$4.prototype = new $h_sci_Map$Map3$Map3Iterator();
$p.constructor = $c_sci_Map$Map3$$anon$4;
/** @constructor */
function $h_sci_Map$Map3$$anon$4() {
}
$h_sci_Map$Map3$$anon$4.prototype = $p;
var $d_sci_Map$Map3$$anon$4 = new $TypeData().i($c_sci_Map$Map3$$anon$4, "scala.collection.immutable.Map$Map3$$anon$4", ({
  gs: 1,
  gt: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sci_Map$Map4$$anon$7(outer) {
  this.dj = 0;
  this.cm = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_sci_Map$Map4$Map4Iterator__sci_Map$Map4__(this, outer);
}
$p = $c_sci_Map$Map4$$anon$7.prototype = new $h_sci_Map$Map4$Map4Iterator();
$p.constructor = $c_sci_Map$Map4$$anon$7;
/** @constructor */
function $h_sci_Map$Map4$$anon$7() {
}
$h_sci_Map$Map4$$anon$7.prototype = $p;
var $d_sci_Map$Map4$$anon$7 = new $TypeData().i($c_sci_Map$Map4$$anon$7, "scala.collection.immutable.Map$Map4$$anon$7", ({
  gu: 1,
  gv: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sci_MapKeyValueTupleHashIterator(rootNode) {
  this.dc = 0;
  this.gD = null;
  this.bF = 0;
  this.fy = null;
  this.fz = null;
  this.ij = 0;
  this.m0 = null;
  $ct_sci_ChampBaseReverseIterator__sci_Node__(this, rootNode);
  this.ij = 0;
}
$p = $c_sci_MapKeyValueTupleHashIterator.prototype = new $h_sci_ChampBaseReverseIterator();
$p.constructor = $c_sci_MapKeyValueTupleHashIterator;
/** @constructor */
function $h_sci_MapKeyValueTupleHashIterator() {
}
$h_sci_MapKeyValueTupleHashIterator.prototype = $p;
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().nH(this.ij, $m_sr_Statics$().H(this.m0), (-889275714));
});
$p.qp = (function() {
  if ((!this.j())) {
    $m_sc_Iterator$().P.i();
  }
  this.ij = this.gD.g2(this.dc);
  this.m0 = this.gD.cU(this.dc);
  this.dc = ((this.dc - 1) | 0);
  return this;
});
$p.i = (function() {
  return this.qp();
});
var $d_sci_MapKeyValueTupleHashIterator = new $TypeData().i($c_sci_MapKeyValueTupleHashIterator, "scala.collection.immutable.MapKeyValueTupleHashIterator", ({
  gx: 1,
  g7: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_sci_MapKeyValueTupleIterator(rootNode) {
  this.bE = 0;
  this.fw = 0;
  this.e1 = null;
  this.bq = 0;
  this.cC = null;
  this.fx = null;
  $ct_sci_ChampBaseIterator__sci_Node__(this, rootNode);
}
$p = $c_sci_MapKeyValueTupleIterator.prototype = new $h_sci_ChampBaseIterator();
$p.constructor = $c_sci_MapKeyValueTupleIterator;
/** @constructor */
function $h_sci_MapKeyValueTupleIterator() {
}
$h_sci_MapKeyValueTupleIterator.prototype = $p;
$p.qo = (function() {
  if ((!this.j())) {
    $m_sc_Iterator$().P.i();
  }
  var payload = this.e1.na(this.bE);
  this.bE = ((1 + this.bE) | 0);
  return payload;
});
$p.i = (function() {
  return this.qo();
});
var $d_sci_MapKeyValueTupleIterator = new $TypeData().i($c_sci_MapKeyValueTupleIterator, "scala.collection.immutable.MapKeyValueTupleIterator", ({
  gy: 1,
  bO: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
function $p_sci_NewVectorIterator__advanceSlice__V($thiz) {
  if (($thiz.bv <= $thiz.aq)) {
    $m_sc_Iterator$().P.i();
  }
  $thiz.dl = ((1 + $thiz.dl) | 0);
  var slice = $thiz.il.ct($thiz.dl);
  while ((slice.a.length === 0)) {
    $thiz.dl = ((1 + $thiz.dl) | 0);
    slice = $thiz.il.ct($thiz.dl);
  }
  $thiz.fB = $thiz.e5;
  var count = $thiz.m2;
  var idx = $thiz.dl;
  var c = (((count + ((count >>> 31) | 0)) | 0) >> 1);
  var a = ((idx - c) | 0);
  var sign = (a >> 31);
  $thiz.dk = ((((1 + c) | 0) - (((a ^ sign) - sign) | 0)) | 0);
  var x46 = $thiz.dk;
  switch (x46) {
    case 1: {
      $thiz.aM = slice;
      break;
    }
    case 2: {
      $thiz.aN = slice;
      break;
    }
    case 3: {
      $thiz.bi = slice;
      break;
    }
    case 4: {
      $thiz.c6 = slice;
      break;
    }
    case 5: {
      $thiz.e4 = slice;
      break;
    }
    case 6: {
      $thiz.ik = slice;
      break;
    }
    default: {
      throw new $c_s_MatchError(x46);
    }
  }
  $thiz.e5 = (($thiz.fB + Math.imul(slice.a.length, (1 << Math.imul(5, (($thiz.dk - 1) | 0))))) | 0);
  if (($thiz.e5 > $thiz.cI)) {
    $thiz.e5 = $thiz.cI;
  }
  if (($thiz.dk > 1)) {
    $thiz.eH = (((1 << Math.imul(5, $thiz.dk)) - 1) | 0);
  }
}
function $p_sci_NewVectorIterator__advance__V($thiz) {
  var pos = (((($thiz.aq - $thiz.bv) | 0) + $thiz.cI) | 0);
  if ((pos === $thiz.e5)) {
    $p_sci_NewVectorIterator__advanceSlice__V($thiz);
  }
  if (($thiz.dk > 1)) {
    var io = ((pos - $thiz.fB) | 0);
    $p_sci_NewVectorIterator__advanceA__I__I__V($thiz, io, ($thiz.eH ^ io));
    $thiz.eH = io;
  }
  $thiz.bv = (($thiz.bv - $thiz.aq) | 0);
  var a = $thiz.aM.a.length;
  var b = $thiz.bv;
  $thiz.cH = ((a < b) ? a : b);
  $thiz.aq = 0;
}
function $p_sci_NewVectorIterator__advanceA__I__I__V($thiz, io, xor) {
  if ((xor < 1024)) {
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  } else if ((xor < 32768)) {
    $thiz.aN = $thiz.bi.a[(31 & ((io >>> 10) | 0))];
    $thiz.aM = $thiz.aN.a[0];
  } else if ((xor < 1048576)) {
    $thiz.bi = $thiz.c6.a[(31 & ((io >>> 15) | 0))];
    $thiz.aN = $thiz.bi.a[0];
    $thiz.aM = $thiz.aN.a[0];
  } else if ((xor < 33554432)) {
    $thiz.c6 = $thiz.e4.a[(31 & ((io >>> 20) | 0))];
    $thiz.bi = $thiz.c6.a[0];
    $thiz.aN = $thiz.bi.a[0];
    $thiz.aM = $thiz.aN.a[0];
  } else {
    $thiz.e4 = $thiz.ik.a[((io >>> 25) | 0)];
    $thiz.c6 = $thiz.e4.a[0];
    $thiz.bi = $thiz.c6.a[0];
    $thiz.aN = $thiz.bi.a[0];
    $thiz.aM = $thiz.aN.a[0];
  }
}
function $p_sci_NewVectorIterator__setA__I__I__V($thiz, io, xor) {
  if ((xor < 1024)) {
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  } else if ((xor < 32768)) {
    $thiz.aN = $thiz.bi.a[(31 & ((io >>> 10) | 0))];
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  } else if ((xor < 1048576)) {
    $thiz.bi = $thiz.c6.a[(31 & ((io >>> 15) | 0))];
    $thiz.aN = $thiz.bi.a[(31 & ((io >>> 10) | 0))];
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  } else if ((xor < 33554432)) {
    $thiz.c6 = $thiz.e4.a[(31 & ((io >>> 20) | 0))];
    $thiz.bi = $thiz.c6.a[(31 & ((io >>> 15) | 0))];
    $thiz.aN = $thiz.bi.a[(31 & ((io >>> 10) | 0))];
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  } else {
    $thiz.e4 = $thiz.ik.a[((io >>> 25) | 0)];
    $thiz.c6 = $thiz.e4.a[(31 & ((io >>> 20) | 0))];
    $thiz.bi = $thiz.c6.a[(31 & ((io >>> 15) | 0))];
    $thiz.aN = $thiz.bi.a[(31 & ((io >>> 10) | 0))];
    $thiz.aM = $thiz.aN.a[(31 & ((io >>> 5) | 0))];
  }
}
/** @constructor */
function $c_sci_NewVectorIterator(v, totalLength, sliceCount) {
  this.il = null;
  this.cI = 0;
  this.m2 = 0;
  this.aM = null;
  this.aN = null;
  this.bi = null;
  this.c6 = null;
  this.e4 = null;
  this.ik = null;
  this.cH = 0;
  this.aq = 0;
  this.eH = 0;
  this.bv = 0;
  this.dl = 0;
  this.dk = 0;
  this.fB = 0;
  this.e5 = 0;
  this.il = v;
  this.cI = totalLength;
  this.m2 = sliceCount;
  this.aM = v.d;
  this.cH = this.aM.a.length;
  this.aq = 0;
  this.eH = 0;
  this.bv = this.cI;
  this.dl = 0;
  this.dk = 1;
  this.fB = 0;
  this.e5 = this.cH;
}
$p = $c_sci_NewVectorIterator.prototype = new $h_sc_AbstractIterator();
$p.constructor = $c_sci_NewVectorIterator;
/** @constructor */
function $h_sci_NewVectorIterator() {
}
$h_sci_NewVectorIterator.prototype = $p;
$p.u = (function() {
  return ((this.bv - this.aq) | 0);
});
$p.j = (function() {
  return (this.bv > this.aq);
});
$p.i = (function() {
  if ((this.aq === this.cH)) {
    $p_sci_NewVectorIterator__advance__V(this);
  }
  var r = this.aM.a[this.aq];
  this.aq = ((1 + this.aq) | 0);
  return r;
});
$p.dF = (function(n) {
  if ((n > 0)) {
    var oldpos = ((((this.aq - this.bv) | 0) + this.cI) | 0);
    var a = ((oldpos + n) | 0);
    var b = this.cI;
    var newpos = ((a < b) ? a : b);
    if ((newpos === this.cI)) {
      this.aq = 0;
      this.bv = 0;
      this.cH = 0;
    } else {
      while ((newpos >= this.e5)) {
        $p_sci_NewVectorIterator__advanceSlice__V(this);
      }
      var io = ((newpos - this.fB) | 0);
      if ((this.dk > 1)) {
        $p_sci_NewVectorIterator__setA__I__I__V(this, io, (this.eH ^ io));
        this.eH = io;
      }
      this.cH = this.aM.a.length;
      this.aq = (31 & io);
      this.bv = ((this.aq + ((this.cI - newpos) | 0)) | 0);
      if ((this.cH > this.bv)) {
        this.cH = this.bv;
      }
    }
  }
  return this;
});
$p.by = (function(xs, start, len) {
  var xsLen = $m_jl_reflect_Array$().bI(xs);
  var srcLen = ((this.bv - this.aq) | 0);
  var limit = ((len < srcLen) ? len : srcLen);
  var capacity = ((start < 0) ? xsLen : ((xsLen - start) | 0));
  var total = ((capacity < limit) ? capacity : limit);
  var total$1 = ((total < 0) ? 0 : total);
  var copied = 0;
  var isBoxed = (xs instanceof $ac_O);
  while ((copied < total$1)) {
    if ((this.aq === this.cH)) {
      $p_sci_NewVectorIterator__advance__V(this);
    }
    var a = ((total$1 - copied) | 0);
    var b = ((this.aM.a.length - this.aq) | 0);
    var count = ((a < b) ? a : b);
    if (isBoxed) {
      var src = this.aM;
      var srcPos = this.aq;
      var destPos = ((start + copied) | 0);
      src.t(srcPos, xs, destPos, count);
    } else {
      $m_s_Array$().fW(this.aM, this.aq, xs, ((start + copied) | 0), count);
    }
    this.aq = ((this.aq + count) | 0);
    copied = ((copied + count) | 0);
  }
  return total$1;
});
var $d_sci_NewVectorIterator = new $TypeData().i($c_sci_NewVectorIterator, "scala.collection.immutable.NewVectorIterator", ({
  gA: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1,
  C: 1
}));
function $ct_scm_ArrayBuilder__($thiz) {
  $thiz.ir = 0;
  $thiz.m7 = 0;
  return $thiz;
}
/** @constructor */
function $c_scm_ArrayBuilder() {
  this.ir = 0;
  this.m7 = 0;
}
$p = $c_scm_ArrayBuilder.prototype = new $h_O();
$p.constructor = $c_scm_ArrayBuilder;
/** @constructor */
function $h_scm_ArrayBuilder() {
}
$h_scm_ArrayBuilder.prototype = $p;
$p.b6 = (function(size) {
  if ((this.ir < size)) {
    this.qI(size);
  }
});
/** @constructor */
function $c_scm_ArraySeq$() {
  this.it = null;
  this.m9 = null;
  $n_scm_ArraySeq$ = this;
  this.it = new $c_sc_ClassTagSeqFactory$AnySeqDelegate(this);
  this.m9 = new $c_scm_ArraySeq$ofRef(new $ac_O(0));
}
$p = $c_scm_ArraySeq$.prototype = new $h_O();
$p.constructor = $c_scm_ArraySeq$;
/** @constructor */
function $h_scm_ArraySeq$() {
}
$h_scm_ArraySeq$.prototype = $p;
$p.pp = (function(it, evidence$1) {
  return this.jd($m_s_Array$().n2(it, evidence$1));
});
$p.h6 = (function(evidence$1) {
  return new $c_scm_Builder$$anon$1(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((x$2) => this.jd(x$2))), new $c_scm_ArrayBuilder$generic(evidence$1.aI()));
});
$p.jd = (function(x) {
  if ((x === null)) {
    return null;
  }
  if ((x instanceof $ac_O)) {
    return new $c_scm_ArraySeq$ofRef(x);
  }
  if ((x instanceof $ac_I)) {
    return new $c_scm_ArraySeq$ofInt(x);
  }
  if ((x instanceof $ac_D)) {
    return new $c_scm_ArraySeq$ofDouble(x);
  }
  if ((x instanceof $ac_J)) {
    return new $c_scm_ArraySeq$ofLong(x);
  }
  if ((x instanceof $ac_F)) {
    return new $c_scm_ArraySeq$ofFloat(x);
  }
  if ((x instanceof $ac_C)) {
    return new $c_scm_ArraySeq$ofChar(x);
  }
  if ((x instanceof $ac_B)) {
    return new $c_scm_ArraySeq$ofByte(x);
  }
  if ((x instanceof $ac_S)) {
    return new $c_scm_ArraySeq$ofShort(x);
  }
  if ((x instanceof $ac_Z)) {
    return new $c_scm_ArraySeq$ofBoolean(x);
  }
  if ($isArrayOf_jl_Void(x, 1)) {
    return new $c_scm_ArraySeq$ofUnit(x);
  }
  throw new $c_s_MatchError(x);
});
$p.iU = (function(it, evidence$1) {
  return this.pp(it, evidence$1);
});
var $d_scm_ArraySeq$ = new $TypeData().i($c_scm_ArraySeq$, "scala.collection.mutable.ArraySeq$", ({
  h2: 1,
  a: 1,
  bw: 1,
  bu: 1,
  bv: 1,
  bB: 1
}));
var $n_scm_ArraySeq$;
function $m_scm_ArraySeq$() {
  if ((!$n_scm_ArraySeq$)) {
    $n_scm_ArraySeq$ = new $c_scm_ArraySeq$();
  }
  return $n_scm_ArraySeq$;
}
/** @constructor */
function $c_scm_HashSet$$anon$1(outer) {
  this.du = 0;
  this.cL = null;
  this.fG = 0;
  this.fF = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_scm_HashSet$HashSetIterator__scm_HashSet__(this, outer);
}
$p = $c_scm_HashSet$$anon$1.prototype = new $h_scm_HashSet$HashSetIterator();
$p.constructor = $c_scm_HashSet$$anon$1;
/** @constructor */
function $h_scm_HashSet$$anon$1() {
}
$h_scm_HashSet$$anon$1.prototype = $p;
$p.iS = (function(nd) {
  return nd.eL;
});
var $d_scm_HashSet$$anon$1 = new $TypeData().i($c_scm_HashSet$$anon$1, "scala.collection.mutable.HashSet$$anon$1", ({
  ha: 1,
  aY: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_scm_HashSet$$anon$2(outer) {
  this.du = 0;
  this.cL = null;
  this.fG = 0;
  this.fF = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  $ct_scm_HashSet$HashSetIterator__scm_HashSet__(this, outer);
}
$p = $c_scm_HashSet$$anon$2.prototype = new $h_scm_HashSet$HashSetIterator();
$p.constructor = $c_scm_HashSet$$anon$2;
/** @constructor */
function $h_scm_HashSet$$anon$2() {
}
$h_scm_HashSet$$anon$2.prototype = $p;
$p.iS = (function(nd) {
  return nd;
});
var $d_scm_HashSet$$anon$2 = new $TypeData().i($c_scm_HashSet$$anon$2, "scala.collection.mutable.HashSet$$anon$2", ({
  hb: 1,
  aY: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_scm_HashSet$$anon$3(outer) {
  this.du = 0;
  this.cL = null;
  this.fG = 0;
  this.fF = null;
  this.iw = 0;
  this.md = null;
  if ((outer === null)) {
    throw $ct_jl_NullPointerException__(new $c_jl_NullPointerException());
  }
  this.md = outer;
  $ct_scm_HashSet$HashSetIterator__scm_HashSet__(this, outer);
  this.iw = 0;
}
$p = $c_scm_HashSet$$anon$3.prototype = new $h_scm_HashSet$HashSetIterator();
$p.constructor = $c_scm_HashSet$$anon$3;
/** @constructor */
function $h_scm_HashSet$$anon$3() {
}
$h_scm_HashSet$$anon$3.prototype = $p;
$p.r = (function() {
  return this.iw;
});
$p.iS = (function(nd) {
  this.iw = $p_scm_HashSet__improveHash__I__I(this.md, nd.cM);
  return this;
});
var $d_scm_HashSet$$anon$3 = new $TypeData().i($c_scm_HashSet$$anon$3, "scala.collection.mutable.HashSet$$anon$3", ({
  hc: 1,
  aY: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1
}));
/** @constructor */
function $c_s_reflect_ClassTag$GenericClassTag(runtimeClass) {
  this.fI = null;
  this.fI = runtimeClass;
}
$p = $c_s_reflect_ClassTag$GenericClassTag.prototype = new $h_O();
$p.constructor = $c_s_reflect_ClassTag$GenericClassTag;
/** @constructor */
function $h_s_reflect_ClassTag$GenericClassTag() {
}
$h_s_reflect_ClassTag$GenericClassTag.prototype = $p;
$p.l = (function(x) {
  return $f_s_reflect_ClassTag__equals__O__Z(this, x);
});
$p.r = (function() {
  return $m_sr_Statics$().H(this.fI);
});
$p.p = (function() {
  return $p_s_reflect_ClassTag__prettyprint$1__jl_Class__T(this, this.fI);
});
$p.aI = (function() {
  return this.fI;
});
$p.bl = (function(len) {
  return this.fI.X.U(len);
});
var $d_s_reflect_ClassTag$GenericClassTag = new $TypeData().i($c_s_reflect_ClassTag$GenericClassTag, "scala.reflect.ClassTag$GenericClassTag", ({
  hs: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2(key$2) {
  this.hM = null;
  this.hN = null;
  $ct_Lcom_raquo_laminar_keys_StyleProp__T__sci_Seq__(this, key$2, $m_sci_Nil$());
}
$p = $c_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2.prototype = new $h_Lcom_raquo_laminar_keys_StyleProp();
$p.constructor = $c_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2;
/** @constructor */
function $h_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2() {
}
$h_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2.prototype = $p;
var $d_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2 = new $TypeData().i($c_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2, "com.raquo.laminar.defs.styles.StyleProps$$anon$2", ({
  dr: 1,
  dR: 1,
  ag: 1,
  dt: 1,
  dM: 1,
  ds: 1,
  du: 1
}));
class $c_ju_DuplicateFormatFlagsException extends $c_ju_IllegalFormatException {
  constructor(f) {
    super();
    this.lo = null;
    this.lo = f;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return (("Flags = '" + this.lo) + "'");
  }
}
var $d_ju_DuplicateFormatFlagsException = new $TypeData().i($c_ju_DuplicateFormatFlagsException, "java.util.DuplicateFormatFlagsException", ({
  eZ: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_FormatFlagsConversionMismatchException extends $c_ju_IllegalFormatException {
  constructor(f, c) {
    super();
    this.lq = null;
    this.lp = 0;
    this.lq = f;
    this.lp = c;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return ((("Conversion = " + $cToS(this.lp)) + ", Flags = ") + this.lq);
  }
}
var $d_ju_FormatFlagsConversionMismatchException = new $TypeData().i($c_ju_FormatFlagsConversionMismatchException, "java.util.FormatFlagsConversionMismatchException", ({
  f0: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatArgumentIndexException extends $c_ju_IllegalFormatException {
  constructor(msg) {
    super();
    this.lu = null;
    this.lu = msg;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return this.lu;
  }
}
var $d_ju_IllegalFormatArgumentIndexException = new $TypeData().i($c_ju_IllegalFormatArgumentIndexException, "java.util.IllegalFormatArgumentIndexException", ({
  f7: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatCodePointException extends $c_ju_IllegalFormatException {
  constructor(c) {
    super();
    this.lv = 0;
    this.lv = c;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    var i = this.lv;
    return ("Code point = 0x" + (i >>> 0.0).toString(16));
  }
}
var $d_ju_IllegalFormatCodePointException = new $TypeData().i($c_ju_IllegalFormatCodePointException, "java.util.IllegalFormatCodePointException", ({
  f8: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatConversionException extends $c_ju_IllegalFormatException {
  constructor(c, arg) {
    super();
    this.lx = 0;
    this.lw = null;
    this.lx = c;
    this.lw = arg;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return ((("" + $cToS(this.lx)) + " != ") + this.lw.X.N);
  }
}
var $d_ju_IllegalFormatConversionException = new $TypeData().i($c_ju_IllegalFormatConversionException, "java.util.IllegalFormatConversionException", ({
  f9: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatFlagsException extends $c_ju_IllegalFormatException {
  constructor(f) {
    super();
    this.ly = null;
    this.ly = f;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return (("Flags = '" + this.ly) + "'");
  }
}
var $d_ju_IllegalFormatFlagsException = new $TypeData().i($c_ju_IllegalFormatFlagsException, "java.util.IllegalFormatFlagsException", ({
  fa: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatPrecisionException extends $c_ju_IllegalFormatException {
  constructor(p) {
    super();
    this.lz = 0;
    this.lz = p;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return ("" + this.lz);
  }
}
var $d_ju_IllegalFormatPrecisionException = new $TypeData().i($c_ju_IllegalFormatPrecisionException, "java.util.IllegalFormatPrecisionException", ({
  fb: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_IllegalFormatWidthException extends $c_ju_IllegalFormatException {
  constructor(w) {
    super();
    this.lA = 0;
    this.lA = w;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return ("" + this.lA);
  }
}
var $d_ju_IllegalFormatWidthException = new $TypeData().i($c_ju_IllegalFormatWidthException, "java.util.IllegalFormatWidthException", ({
  fc: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_MissingFormatArgumentException extends $c_ju_IllegalFormatException {
  constructor(s) {
    super();
    this.lB = null;
    this.lB = s;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return (("Format specifier '" + this.lB) + "'");
  }
}
var $d_ju_MissingFormatArgumentException = new $TypeData().i($c_ju_MissingFormatArgumentException, "java.util.MissingFormatArgumentException", ({
  fd: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_MissingFormatWidthException extends $c_ju_IllegalFormatException {
  constructor(s) {
    super();
    this.lC = null;
    this.lC = s;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return this.lC;
  }
}
var $d_ju_MissingFormatWidthException = new $TypeData().i($c_ju_MissingFormatWidthException, "java.util.MissingFormatWidthException", ({
  fe: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
class $c_ju_UnknownFormatConversionException extends $c_ju_IllegalFormatException {
  constructor(s) {
    super();
    this.lD = null;
    this.lD = s;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return (("Conversion = '" + this.lD) + "'");
  }
}
var $d_ju_UnknownFormatConversionException = new $TypeData().i($c_ju_UnknownFormatConversionException, "java.util.UnknownFormatConversionException", ({
  fg: 1,
  X: 1,
  R: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1
}));
function $f_sc_View__toString__T($thiz) {
  return ($thiz.bH() + "(<not computed>)");
}
function $is_sc_View(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.Z)));
}
function $isArrayOf_sc_View(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.Z)));
}
/** @constructor */
function $c_scm_ArrayBuilder$generic(elementClass) {
  this.ir = 0;
  this.m7 = 0;
  this.eK = null;
  this.m8 = false;
  this.is = null;
  this.eK = elementClass;
  $ct_scm_ArrayBuilder__(this);
  this.m8 = (elementClass === $d_C.l());
  this.is = [];
}
$p = $c_scm_ArrayBuilder$generic.prototype = new $h_scm_ArrayBuilder();
$p.constructor = $c_scm_ArrayBuilder$generic;
/** @constructor */
function $h_scm_ArrayBuilder$generic() {
}
$h_scm_ArrayBuilder$generic.prototype = $p;
$p.my = (function(elem) {
  var unboxedElem = (this.m8 ? $uC(elem) : ((elem === null) ? $m_scm_ArrayBuilder$().ha(this.eK) : elem));
  this.is.push(unboxedElem);
  return this;
});
$p.og = (function(xs) {
  var it = xs.h();
  while (it.j()) {
    this.my(it.i());
  }
  return this;
});
$p.qI = (function(size) {
});
$p.aV = (function() {
  return $m_scm_ArrayBuilder$().h9(((this.eK === $d_V.l()) ? $d_jl_Void.l() : (((this.eK === $d_sr_Null$.l()) || (this.eK === $d_sr_Nothing$.l())) ? $d_O.l() : this.eK)), this.is);
});
$p.p = (function() {
  return "ArrayBuilder.generic";
});
$p.aU = (function(elem) {
  return this.my(elem);
});
$p.aT = (function(elems) {
  return this.og(elems);
});
var $d_scm_ArrayBuilder$generic = new $TypeData().i($c_scm_ArrayBuilder$generic, "scala.collection.mutable.ArrayBuilder$generic", ({
  h1: 1,
  gZ: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1,
  a: 1
}));
/** @constructor */
function $c_scm_CheckedIndexedSeqView$CheckedIterator(self, mutationCount) {
  this.ib = null;
  this.cz = 0;
  this.bc = 0;
  this.mc = null;
  this.mb = 0;
  this.mc = mutationCount;
  $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(this, self);
  this.mb = (mutationCount.L() | 0);
}
$p = $c_scm_CheckedIndexedSeqView$CheckedIterator.prototype = new $h_sc_IndexedSeqView$IndexedSeqViewIterator();
$p.constructor = $c_scm_CheckedIndexedSeqView$CheckedIterator;
/** @constructor */
function $h_scm_CheckedIndexedSeqView$CheckedIterator() {
}
$h_scm_CheckedIndexedSeqView$CheckedIterator.prototype = $p;
$p.j = (function() {
  $m_scm_MutationTracker$().mK(this.mb, (this.mc.L() | 0), "mutation occurred during iteration");
  return (this.bc > 0);
});
var $d_scm_CheckedIndexedSeqView$CheckedIterator = new $TypeData().i($c_scm_CheckedIndexedSeqView$CheckedIterator, "scala.collection.mutable.CheckedIndexedSeqView$CheckedIterator", ({
  h6: 1,
  bx: 1,
  v: 1,
  b: 1,
  c: 1,
  w: 1,
  a: 1
}));
/** @constructor */
function $c_s_reflect_AnyValManifest() {
  this.N = null;
}
$p = $c_s_reflect_AnyValManifest.prototype = new $h_O();
$p.constructor = $c_s_reflect_AnyValManifest;
/** @constructor */
function $h_s_reflect_AnyValManifest() {
}
$h_s_reflect_AnyValManifest.prototype = $p;
$p.p = (function() {
  return this.N;
});
$p.l = (function(that) {
  return (this === that);
});
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ClassTypeManifest() {
}
$p = $c_s_reflect_ManifestFactory$ClassTypeManifest.prototype = new $h_O();
$p.constructor = $c_s_reflect_ManifestFactory$ClassTypeManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ClassTypeManifest() {
}
$h_s_reflect_ManifestFactory$ClassTypeManifest.prototype = $p;
class $c_sjs_js_JavaScriptException extends $c_jl_RuntimeException {
  constructor(exception) {
    super();
    this.Z = null;
    this.Z = exception;
    $ct_jl_Throwable__T__jl_Throwable__Z__Z__(this, null, null, true, true);
  }
  bf() {
    return $dp_toString__T(this.Z);
  }
  b5() {
    return "JavaScriptException";
  }
  b3() {
    return 1;
  }
  b4(x$1) {
    return ((x$1 === 0) ? this.Z : $m_sr_Statics$().pV(x$1));
  }
  bJ() {
    return new $c_sr_ScalaRunTime$$anon$1(this);
  }
  r() {
    return $m_s_util_hashing_MurmurHash3$().eX(this, 1744042595, true);
  }
  l(x$1) {
    return ((this === x$1) || ((x$1 instanceof $c_sjs_js_JavaScriptException) && $m_sr_BoxesRunTime$().k(this.Z, x$1.Z)));
  }
}
function $isArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.cf)));
}
var $d_sjs_js_JavaScriptException = new $TypeData().i($c_sjs_js_JavaScriptException, "scala.scalajs.js.JavaScriptException", ({
  cf: 1,
  u: 1,
  t: 1,
  n: 1,
  a: 1,
  F: 1,
  d: 1
}));
function $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V($thiz, newValue) {
  if ((!($thiz.h3() === (void 0)))) {
    $thiz.gP($m_Lcom_raquo_airstream_core_Signal$().ni());
  }
  $thiz.jf(newValue);
}
function $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try($thiz) {
  var x = $thiz.h3();
  if ((x === (void 0))) {
    $thiz.gP($m_Lcom_raquo_airstream_core_Signal$().ni());
    var nextValue = $thiz.gW();
    $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V($thiz, nextValue);
    var $x_1 = nextValue;
  } else {
    var $x_1 = x;
  }
  return $x_1;
}
function $f_Lcom_raquo_airstream_core_WritableSignal__fireValue__O__Lcom_raquo_airstream_core_Transaction__V($thiz, nextValue, transaction) {
  $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V($thiz, new $c_s_util_Success(nextValue), transaction);
}
function $f_Lcom_raquo_airstream_core_WritableSignal__fireError__jl_Throwable__Lcom_raquo_airstream_core_Transaction__V($thiz, nextError, transaction) {
  $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V($thiz, new $c_s_util_Failure(nextError), transaction);
}
function $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V($thiz, nextValue, transaction) {
  $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V($thiz, nextValue);
  var isError = nextValue.ja();
  var elem = false;
  elem = false;
  $thiz.g3(false);
  var this$ = $thiz.eQ();
  var index = 0;
  while ((index < (this$.length | 0))) {
    var observer = this$[index];
    index = ((1 + index) | 0);
    observer.dK(nextValue);
    if ((isError && (!elem))) {
      var ev$5 = true;
      elem = ev$5;
    }
  }
  var this$$1 = $thiz.eT();
  var index$1 = 0;
  while ((index$1 < (this$$1.length | 0))) {
    var observer$1 = this$$1[index$1];
    index$1 = ((1 + index$1) | 0);
    observer$1.nn(nextValue, transaction);
    if ((isError && (!elem))) {
      var ev$6 = true;
      elem = ev$6;
    }
  }
  $thiz.g3(true);
  var x = $thiz.h4();
  if ((x !== (void 0))) {
    var i = 0;
    var len = (x.length | 0);
    while ((i < len)) {
      x[i].L();
      i = ((1 + i) | 0);
    }
    x.length = 0;
  }
  if ((isError && (!elem))) {
    nextValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((err) => {
      $m_Lcom_raquo_airstream_core_AirstreamError$().cc(err);
    })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => (void 0))));
  }
}
function $p_sc_StrictOptimizedLinearSeqOps__loop$2__I__sc_LinearSeq__sc_LinearSeq($thiz, n, s) {
  var s$tailLocal1 = s;
  var n$tailLocal1 = n;
  while (true) {
    if (((n$tailLocal1 <= 0) || s$tailLocal1.c())) {
      return s$tailLocal1;
    } else {
      var n$tailLocal1$tmp1 = ((n$tailLocal1 - 1) | 0);
      var s$tailLocal1$tmp1 = s$tailLocal1.s();
      n$tailLocal1 = n$tailLocal1$tmp1;
      s$tailLocal1 = s$tailLocal1$tmp1;
    }
  }
}
function $f_sci_StrictOptimizedSeqOps__distinctBy__F1__O($thiz, f) {
  if (($thiz.b2(1) <= 0)) {
    return $thiz;
  } else {
    var builder = $thiz.g6();
    var seen = $ct_scm_HashSet__(new $c_scm_HashSet());
    var it = $thiz.h();
    var different = false;
    while (it.j()) {
      var next = it.i();
      if (seen.gQ(f.b(next))) {
        builder.aU(next);
      } else {
        different = true;
      }
    }
    return (different ? builder.aV() : $thiz);
  }
}
/** @constructor */
function $c_s_reflect_ManifestFactory$BooleanManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$BooleanManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$BooleanManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$BooleanManifest() {
}
$h_s_reflect_ManifestFactory$BooleanManifest.prototype = $p;
$p.aI = (function() {
  return $d_Z.l();
});
$p.bl = (function(len) {
  return new $ac_Z(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ByteManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$ByteManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$ByteManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ByteManifest() {
}
$h_s_reflect_ManifestFactory$ByteManifest.prototype = $p;
$p.aI = (function() {
  return $d_B.l();
});
$p.bl = (function(len) {
  return new $ac_B(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$CharManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$CharManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$CharManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$CharManifest() {
}
$h_s_reflect_ManifestFactory$CharManifest.prototype = $p;
$p.aI = (function() {
  return $d_C.l();
});
$p.bl = (function(len) {
  return new $ac_C(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$DoubleManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$DoubleManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$DoubleManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$DoubleManifest() {
}
$h_s_reflect_ManifestFactory$DoubleManifest.prototype = $p;
$p.aI = (function() {
  return $d_D.l();
});
$p.bl = (function(len) {
  return new $ac_D(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$FloatManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$FloatManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$FloatManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$FloatManifest() {
}
$h_s_reflect_ManifestFactory$FloatManifest.prototype = $p;
$p.aI = (function() {
  return $d_F.l();
});
$p.bl = (function(len) {
  return new $ac_F(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$IntManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$IntManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$IntManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$IntManifest() {
}
$h_s_reflect_ManifestFactory$IntManifest.prototype = $p;
$p.aI = (function() {
  return $d_I.l();
});
$p.bl = (function(len) {
  return new $ac_I(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$LongManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$LongManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$LongManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$LongManifest() {
}
$h_s_reflect_ManifestFactory$LongManifest.prototype = $p;
$p.aI = (function() {
  return $d_J.l();
});
$p.bl = (function(len) {
  return new $ac_J(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$PhantomManifest() {
  this.cO = null;
}
$p = $c_s_reflect_ManifestFactory$PhantomManifest.prototype = new $h_s_reflect_ManifestFactory$ClassTypeManifest();
$p.constructor = $c_s_reflect_ManifestFactory$PhantomManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$PhantomManifest() {
}
$h_s_reflect_ManifestFactory$PhantomManifest.prototype = $p;
$p.p = (function() {
  return this.cO;
});
$p.l = (function(that) {
  return (this === that);
});
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ShortManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$ShortManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$ShortManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ShortManifest() {
}
$h_s_reflect_ManifestFactory$ShortManifest.prototype = $p;
$p.aI = (function() {
  return $d_S.l();
});
$p.bl = (function(len) {
  return new $ac_S(len);
});
/** @constructor */
function $c_s_reflect_ManifestFactory$UnitManifest() {
  this.N = null;
}
$p = $c_s_reflect_ManifestFactory$UnitManifest.prototype = new $h_s_reflect_AnyValManifest();
$p.constructor = $c_s_reflect_ManifestFactory$UnitManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$UnitManifest() {
}
$h_s_reflect_ManifestFactory$UnitManifest.prototype = $p;
$p.aI = (function() {
  return $d_V.l();
});
$p.bl = (function(len) {
  return new ($d_jl_Void.r().C)(len);
});
function $f_Lcom_raquo_airstream_common_MultiParentSignal___parentLastUpdateIds__Lcom_raquo_ew_JsArray($thiz) {
  return $thiz.f3.map(((_$1) => _$1.eO()));
}
function $f_Lcom_raquo_airstream_common_MultiParentSignal__onWillStart__V($thiz) {
  var arr = $thiz.f3;
  var i = 0;
  var len = (arr.length | 0);
  while ((i < len)) {
    $f_Lcom_raquo_airstream_core_WritableObservable__maybeWillStart__V(arr[i]);
    i = ((1 + i) | 0);
  }
  if ($f_Lcom_raquo_airstream_common_MultiParentSignal__updateParentLastUpdateIds__Z($thiz)) {
    $f_Lcom_raquo_airstream_common_MultiParentSignal__updateCurrentValueFromParent__V($thiz);
  }
}
function $f_Lcom_raquo_airstream_common_MultiParentSignal__updateParentLastUpdateIds__Z($thiz) {
  var elem = false;
  elem = false;
  var arr = $thiz.f3;
  var i = 0;
  var len = (arr.length | 0);
  while ((i < len)) {
    var parent = arr[i];
    var ix = i;
    var newLastUpdateId = parent.eO();
    if ((newLastUpdateId !== ($thiz.mr()[ix] | 0))) {
      $thiz.mr()[ix] = newLastUpdateId;
      var ev$3 = true;
      elem = ev$3;
    }
    i = ((1 + i) | 0);
  }
  return elem;
}
function $f_Lcom_raquo_airstream_common_MultiParentSignal__updateCurrentValueFromParent__V($thiz) {
  $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V($thiz, $thiz.iJ());
}
/** @constructor */
function $c_sc_AbstractView() {
}
$p = $c_sc_AbstractView.prototype = new $h_sc_AbstractIterable();
$p.constructor = $c_sc_AbstractView;
/** @constructor */
function $h_sc_AbstractView() {
}
$h_sc_AbstractView.prototype = $p;
$p.b1 = (function() {
  return $m_sc_View$();
});
$p.p = (function() {
  return $f_sc_View__toString__T(this);
});
$p.bb = (function() {
  return "View";
});
function $f_sc_Set__equals__O__Z($thiz, that) {
  if (($thiz === that)) {
    return true;
  } else if ($is_sc_Set(that)) {
    if (($thiz.aJ() === that.aJ())) {
      try {
        return $thiz.qZ(that);
      } catch (e) {
        if (false) {
          return false;
        } else {
          throw e;
        }
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function $is_sc_Set(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.aQ)));
}
function $isArrayOf_sc_Set(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.aQ)));
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyManifest$() {
  this.cO = null;
  this.cO = "Any";
  $m_sci_Nil$();
}
$p = $c_s_reflect_ManifestFactory$AnyManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$p.constructor = $c_s_reflect_ManifestFactory$AnyManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyManifest$() {
}
$h_s_reflect_ManifestFactory$AnyManifest$.prototype = $p;
$p.aI = (function() {
  return $d_O.l();
});
$p.bl = (function(len) {
  return new $ac_O(len);
});
var $d_s_reflect_ManifestFactory$AnyManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$AnyManifest$, "scala.reflect.ManifestFactory$AnyManifest$", ({
  ht: 1,
  aC: 1,
  aB: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$AnyManifest$;
function $m_s_reflect_ManifestFactory$AnyManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyManifest$)) {
    $n_s_reflect_ManifestFactory$AnyManifest$ = new $c_s_reflect_ManifestFactory$AnyManifest$();
  }
  return $n_s_reflect_ManifestFactory$AnyManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$BooleanManifest$() {
  this.N = null;
  this.N = "Boolean";
}
$p = $c_s_reflect_ManifestFactory$BooleanManifest$.prototype = new $h_s_reflect_ManifestFactory$BooleanManifest();
$p.constructor = $c_s_reflect_ManifestFactory$BooleanManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$BooleanManifest$() {
}
$h_s_reflect_ManifestFactory$BooleanManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$BooleanManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$BooleanManifest$, "scala.reflect.ManifestFactory$BooleanManifest$", ({
  hv: 1,
  hu: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$BooleanManifest$;
function $m_s_reflect_ManifestFactory$BooleanManifest$() {
  if ((!$n_s_reflect_ManifestFactory$BooleanManifest$)) {
    $n_s_reflect_ManifestFactory$BooleanManifest$ = new $c_s_reflect_ManifestFactory$BooleanManifest$();
  }
  return $n_s_reflect_ManifestFactory$BooleanManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ByteManifest$() {
  this.N = null;
  this.N = "Byte";
}
$p = $c_s_reflect_ManifestFactory$ByteManifest$.prototype = new $h_s_reflect_ManifestFactory$ByteManifest();
$p.constructor = $c_s_reflect_ManifestFactory$ByteManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ByteManifest$() {
}
$h_s_reflect_ManifestFactory$ByteManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$ByteManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$ByteManifest$, "scala.reflect.ManifestFactory$ByteManifest$", ({
  hx: 1,
  hw: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$ByteManifest$;
function $m_s_reflect_ManifestFactory$ByteManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ByteManifest$)) {
    $n_s_reflect_ManifestFactory$ByteManifest$ = new $c_s_reflect_ManifestFactory$ByteManifest$();
  }
  return $n_s_reflect_ManifestFactory$ByteManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$CharManifest$() {
  this.N = null;
  this.N = "Char";
}
$p = $c_s_reflect_ManifestFactory$CharManifest$.prototype = new $h_s_reflect_ManifestFactory$CharManifest();
$p.constructor = $c_s_reflect_ManifestFactory$CharManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$CharManifest$() {
}
$h_s_reflect_ManifestFactory$CharManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$CharManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$CharManifest$, "scala.reflect.ManifestFactory$CharManifest$", ({
  hz: 1,
  hy: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$CharManifest$;
function $m_s_reflect_ManifestFactory$CharManifest$() {
  if ((!$n_s_reflect_ManifestFactory$CharManifest$)) {
    $n_s_reflect_ManifestFactory$CharManifest$ = new $c_s_reflect_ManifestFactory$CharManifest$();
  }
  return $n_s_reflect_ManifestFactory$CharManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$DoubleManifest$() {
  this.N = null;
  this.N = "Double";
}
$p = $c_s_reflect_ManifestFactory$DoubleManifest$.prototype = new $h_s_reflect_ManifestFactory$DoubleManifest();
$p.constructor = $c_s_reflect_ManifestFactory$DoubleManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$DoubleManifest$() {
}
$h_s_reflect_ManifestFactory$DoubleManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$DoubleManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$DoubleManifest$, "scala.reflect.ManifestFactory$DoubleManifest$", ({
  hB: 1,
  hA: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$DoubleManifest$;
function $m_s_reflect_ManifestFactory$DoubleManifest$() {
  if ((!$n_s_reflect_ManifestFactory$DoubleManifest$)) {
    $n_s_reflect_ManifestFactory$DoubleManifest$ = new $c_s_reflect_ManifestFactory$DoubleManifest$();
  }
  return $n_s_reflect_ManifestFactory$DoubleManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$FloatManifest$() {
  this.N = null;
  this.N = "Float";
}
$p = $c_s_reflect_ManifestFactory$FloatManifest$.prototype = new $h_s_reflect_ManifestFactory$FloatManifest();
$p.constructor = $c_s_reflect_ManifestFactory$FloatManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$FloatManifest$() {
}
$h_s_reflect_ManifestFactory$FloatManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$FloatManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$FloatManifest$, "scala.reflect.ManifestFactory$FloatManifest$", ({
  hD: 1,
  hC: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$FloatManifest$;
function $m_s_reflect_ManifestFactory$FloatManifest$() {
  if ((!$n_s_reflect_ManifestFactory$FloatManifest$)) {
    $n_s_reflect_ManifestFactory$FloatManifest$ = new $c_s_reflect_ManifestFactory$FloatManifest$();
  }
  return $n_s_reflect_ManifestFactory$FloatManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$IntManifest$() {
  this.N = null;
  this.N = "Int";
}
$p = $c_s_reflect_ManifestFactory$IntManifest$.prototype = new $h_s_reflect_ManifestFactory$IntManifest();
$p.constructor = $c_s_reflect_ManifestFactory$IntManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$IntManifest$() {
}
$h_s_reflect_ManifestFactory$IntManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$IntManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$IntManifest$, "scala.reflect.ManifestFactory$IntManifest$", ({
  hF: 1,
  hE: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$IntManifest$;
function $m_s_reflect_ManifestFactory$IntManifest$() {
  if ((!$n_s_reflect_ManifestFactory$IntManifest$)) {
    $n_s_reflect_ManifestFactory$IntManifest$ = new $c_s_reflect_ManifestFactory$IntManifest$();
  }
  return $n_s_reflect_ManifestFactory$IntManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$LongManifest$() {
  this.N = null;
  this.N = "Long";
}
$p = $c_s_reflect_ManifestFactory$LongManifest$.prototype = new $h_s_reflect_ManifestFactory$LongManifest();
$p.constructor = $c_s_reflect_ManifestFactory$LongManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$LongManifest$() {
}
$h_s_reflect_ManifestFactory$LongManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$LongManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$LongManifest$, "scala.reflect.ManifestFactory$LongManifest$", ({
  hH: 1,
  hG: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$LongManifest$;
function $m_s_reflect_ManifestFactory$LongManifest$() {
  if ((!$n_s_reflect_ManifestFactory$LongManifest$)) {
    $n_s_reflect_ManifestFactory$LongManifest$ = new $c_s_reflect_ManifestFactory$LongManifest$();
  }
  return $n_s_reflect_ManifestFactory$LongManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NothingManifest$() {
  this.cO = null;
  this.cO = "Nothing";
  $m_sci_Nil$();
}
$p = $c_s_reflect_ManifestFactory$NothingManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$p.constructor = $c_s_reflect_ManifestFactory$NothingManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NothingManifest$() {
}
$h_s_reflect_ManifestFactory$NothingManifest$.prototype = $p;
$p.aI = (function() {
  return $d_sr_Nothing$.l();
});
$p.bl = (function(len) {
  return new ($d_sr_Nothing$.r().C)(len);
});
var $d_s_reflect_ManifestFactory$NothingManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$NothingManifest$, "scala.reflect.ManifestFactory$NothingManifest$", ({
  hI: 1,
  aC: 1,
  aB: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$NothingManifest$;
function $m_s_reflect_ManifestFactory$NothingManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NothingManifest$)) {
    $n_s_reflect_ManifestFactory$NothingManifest$ = new $c_s_reflect_ManifestFactory$NothingManifest$();
  }
  return $n_s_reflect_ManifestFactory$NothingManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NullManifest$() {
  this.cO = null;
  this.cO = "Null";
  $m_sci_Nil$();
}
$p = $c_s_reflect_ManifestFactory$NullManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$p.constructor = $c_s_reflect_ManifestFactory$NullManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NullManifest$() {
}
$h_s_reflect_ManifestFactory$NullManifest$.prototype = $p;
$p.aI = (function() {
  return $d_sr_Null$.l();
});
$p.bl = (function(len) {
  return new ($d_sr_Null$.r().C)(len);
});
var $d_s_reflect_ManifestFactory$NullManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$NullManifest$, "scala.reflect.ManifestFactory$NullManifest$", ({
  hJ: 1,
  aC: 1,
  aB: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$NullManifest$;
function $m_s_reflect_ManifestFactory$NullManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NullManifest$)) {
    $n_s_reflect_ManifestFactory$NullManifest$ = new $c_s_reflect_ManifestFactory$NullManifest$();
  }
  return $n_s_reflect_ManifestFactory$NullManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ObjectManifest$() {
  this.cO = null;
  this.cO = "Object";
  $m_sci_Nil$();
}
$p = $c_s_reflect_ManifestFactory$ObjectManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$p.constructor = $c_s_reflect_ManifestFactory$ObjectManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ObjectManifest$() {
}
$h_s_reflect_ManifestFactory$ObjectManifest$.prototype = $p;
$p.aI = (function() {
  return $d_O.l();
});
$p.bl = (function(len) {
  return new $ac_O(len);
});
var $d_s_reflect_ManifestFactory$ObjectManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$ObjectManifest$, "scala.reflect.ManifestFactory$ObjectManifest$", ({
  hK: 1,
  aC: 1,
  aB: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$ObjectManifest$;
function $m_s_reflect_ManifestFactory$ObjectManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ObjectManifest$)) {
    $n_s_reflect_ManifestFactory$ObjectManifest$ = new $c_s_reflect_ManifestFactory$ObjectManifest$();
  }
  return $n_s_reflect_ManifestFactory$ObjectManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ShortManifest$() {
  this.N = null;
  this.N = "Short";
}
$p = $c_s_reflect_ManifestFactory$ShortManifest$.prototype = new $h_s_reflect_ManifestFactory$ShortManifest();
$p.constructor = $c_s_reflect_ManifestFactory$ShortManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ShortManifest$() {
}
$h_s_reflect_ManifestFactory$ShortManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$ShortManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$ShortManifest$, "scala.reflect.ManifestFactory$ShortManifest$", ({
  hM: 1,
  hL: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$ShortManifest$;
function $m_s_reflect_ManifestFactory$ShortManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ShortManifest$)) {
    $n_s_reflect_ManifestFactory$ShortManifest$ = new $c_s_reflect_ManifestFactory$ShortManifest$();
  }
  return $n_s_reflect_ManifestFactory$ShortManifest$;
}
/** @constructor */
function $c_s_reflect_ManifestFactory$UnitManifest$() {
  this.N = null;
  this.N = "Unit";
}
$p = $c_s_reflect_ManifestFactory$UnitManifest$.prototype = new $h_s_reflect_ManifestFactory$UnitManifest();
$p.constructor = $c_s_reflect_ManifestFactory$UnitManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$UnitManifest$() {
}
$h_s_reflect_ManifestFactory$UnitManifest$.prototype = $p;
var $d_s_reflect_ManifestFactory$UnitManifest$ = new $TypeData().i($c_s_reflect_ManifestFactory$UnitManifest$, "scala.reflect.ManifestFactory$UnitManifest$", ({
  hO: 1,
  hN: 1,
  a7: 1,
  a: 1,
  Q: 1,
  P: 1,
  d: 1,
  E: 1,
  U: 1
}));
var $n_s_reflect_ManifestFactory$UnitManifest$;
function $m_s_reflect_ManifestFactory$UnitManifest$() {
  if ((!$n_s_reflect_ManifestFactory$UnitManifest$)) {
    $n_s_reflect_ManifestFactory$UnitManifest$ = new $c_s_reflect_ManifestFactory$UnitManifest$();
  }
  return $n_s_reflect_ManifestFactory$UnitManifest$;
}
/** @constructor */
function $c_Lcom_raquo_airstream_state_VarSignal(initial, parentDisplayName) {
  this.k9 = null;
  this.k8 = false;
  this.ka = null;
  this.hA = 0;
  this.k6 = null;
  this.k7 = null;
  this.kd = false;
  this.hB = null;
  this.kb = null;
  this.kc = 0;
  this.kb = parentDisplayName;
  this.k9 = (void 0);
  $f_Lcom_raquo_airstream_core_BaseObservable__$init$__V(this);
  this.hA = 0;
  $f_Lcom_raquo_airstream_core_WritableObservable__$init$__V(this);
  this.hB = (void 0);
  this.kc = 1;
  $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V(this, initial);
}
$p = $c_Lcom_raquo_airstream_state_VarSignal.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_state_VarSignal;
/** @constructor */
function $h_Lcom_raquo_airstream_state_VarSignal() {
}
$h_Lcom_raquo_airstream_state_VarSignal.prototype = $p;
$p.eg = (function() {
  return this.k9;
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.h1 = (function() {
  return this.k8;
});
$p.h4 = (function() {
  return this.ka;
});
$p.g3 = (function(x$1) {
  this.k8 = x$1;
});
$p.h5 = (function(x$1) {
  this.ka = x$1;
});
$p.jk = (function() {
});
$p.l = (function(obj) {
  return (this === obj);
});
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
$p.eO = (function() {
  return this.hA;
});
$p.gP = (function(x$1) {
  this.hA = x$1;
});
$p.cd = (function() {
  return this;
});
$p.jj = (function() {
  $f_Lcom_raquo_airstream_core_Signal__onStart__V(this);
});
$p.eQ = (function() {
  return this.k6;
});
$p.eT = (function() {
  return this.k7;
});
$p.jw = (function() {
  return this.kd;
});
$p.gc = (function(x$1) {
  this.kd = x$1;
});
$p.iG = (function(x$0) {
  this.k6 = x$0;
});
$p.iH = (function(x$0) {
  this.k7 = x$0;
});
$p.h3 = (function() {
  return this.hB;
});
$p.jf = (function(x$1) {
  this.hB = x$1;
});
$p.eZ = (function() {
  return $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try(this);
});
$p.hc = (function() {
  return this.kc;
});
$p.gW = (function() {
  return $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try(this);
});
$p.jl = (function() {
});
$p.ea = (function() {
  return (this.kb.L() + ".signal");
});
var $d_Lcom_raquo_airstream_state_VarSignal = new $TypeData().i($c_Lcom_raquo_airstream_state_VarSignal, "com.raquo.airstream.state.VarSignal", ({
  d1: 1,
  ap: 1,
  a4: 1,
  at: 1,
  au: 1,
  aq: 1,
  aw: 1,
  aE: 1,
  aF: 1,
  cX: 1
}));
function $f_sc_Seq__equals__O__Z($thiz, o) {
  if (($thiz === o)) {
    return true;
  } else {
    if ($is_sc_Seq(o)) {
      if (o.gV($thiz)) {
        return $thiz.eY(o);
      }
    }
    return false;
  }
}
function $is_sc_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.m)));
}
function $isArrayOf_sc_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.m)));
}
/** @constructor */
function $c_sc_View$$anon$1(it$3) {
  this.lU = null;
  this.lU = it$3;
}
$p = $c_sc_View$$anon$1.prototype = new $h_sc_AbstractView();
$p.constructor = $c_sc_View$$anon$1;
/** @constructor */
function $h_sc_View$$anon$1() {
}
$h_sc_View$$anon$1.prototype = $p;
$p.h = (function() {
  return this.lU.L();
});
var $d_sc_View$$anon$1 = new $TypeData().i($c_sc_View$$anon$1, "scala.collection.View$$anon$1", ({
  g2: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1
}));
/** @constructor */
function $c_sc_View$DistinctBy(underlying, f) {
  this.gB = null;
  this.lV = null;
  this.gB = underlying;
  this.lV = f;
}
$p = $c_sc_View$DistinctBy.prototype = new $h_sc_AbstractView();
$p.constructor = $c_sc_View$DistinctBy;
/** @constructor */
function $h_sc_View$DistinctBy() {
}
$h_sc_View$DistinctBy.prototype = $p;
$p.h = (function() {
  var this$1 = this.gB.h();
  return new $c_sc_Iterator$$anon$8(this.lV, this$1);
});
$p.u = (function() {
  return ((this.gB.u() === 0) ? 0 : (-1));
});
$p.c = (function() {
  return this.gB.c();
});
var $d_sc_View$DistinctBy = new $TypeData().i($c_sc_View$DistinctBy, "scala.collection.View$DistinctBy", ({
  g3: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1
}));
function $ct_sc_View$Map__sc_IterableOps__F1__($thiz, underlying, f) {
  $thiz.dZ = underlying;
  $thiz.fv = f;
  return $thiz;
}
/** @constructor */
function $c_sc_View$Map() {
  this.dZ = null;
  this.fv = null;
}
$p = $c_sc_View$Map.prototype = new $h_sc_AbstractView();
$p.constructor = $c_sc_View$Map;
/** @constructor */
function $h_sc_View$Map() {
}
$h_sc_View$Map.prototype = $p;
$p.h = (function() {
  var this$1 = this.dZ.h();
  return new $c_sc_Iterator$$anon$9(this.fv, this$1);
});
$p.u = (function() {
  return this.dZ.u();
});
$p.c = (function() {
  return this.dZ.c();
});
var $d_sc_View$Map = new $TypeData().i($c_sc_View$Map, "scala.collection.View$Map", ({
  az: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1
}));
function $f_Lcom_raquo_airstream_common_SingleParentSignal__$init$__V($thiz) {
  $thiz.hs = ($thiz.cW !== null);
  $thiz.gg = (-1);
}
function $f_Lcom_raquo_airstream_common_SingleParentSignal__onWillStart__V($thiz) {
  $f_Lcom_raquo_airstream_core_WritableObservable__maybeWillStart__V($thiz.cW);
  if ($thiz.hs) {
    var newParentLastUpdateId = $thiz.cW.eO();
    if ((newParentLastUpdateId !== $thiz.gg)) {
      $f_Lcom_raquo_airstream_common_SingleParentSignal__updateCurrentValueFromParent__s_util_Try__I__V($thiz, $thiz.gW(), newParentLastUpdateId);
    }
  }
}
function $f_Lcom_raquo_airstream_common_SingleParentSignal__updateCurrentValueFromParent__s_util_Try__I__V($thiz, nextValue, nextParentLastUpdateId) {
  $f_Lcom_raquo_airstream_core_WritableSignal__setCurrentValue__s_util_Try__V($thiz, nextValue);
  $thiz.gg = nextParentLastUpdateId;
}
function $f_Lcom_raquo_airstream_common_SingleParentSignal__onTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V($thiz, nextParentValue, transaction) {
  if ($thiz.hs) {
    $thiz.gg = $thiz.cW.eO();
  }
}
function $f_Lcom_raquo_airstream_common_SingleParentSignal__onStart__V($thiz) {
  $f_Lcom_raquo_airstream_core_WritableObservable__addInternalObserver__Lcom_raquo_airstream_core_InternalObserver__Z__V($thiz.cW, $thiz, false);
  $f_Lcom_raquo_airstream_core_Signal__onStart__V($thiz);
}
function $f_Lcom_raquo_airstream_common_SingleParentSignal__onStop__V($thiz) {
  $f_Lcom_raquo_airstream_core_BaseObservable__removeInternalObserver__Lcom_raquo_airstream_core_InternalObserver__V($thiz.cW, $thiz);
}
/** @constructor */
function $c_sc_AbstractSet() {
}
$p = $c_sc_AbstractSet.prototype = new $h_sc_AbstractIterable();
$p.constructor = $c_sc_AbstractSet;
/** @constructor */
function $h_sc_AbstractSet() {
}
$h_sc_AbstractSet.prototype = $p;
$p.qZ = (function(that) {
  return this.eR(that);
});
$p.l = (function(that) {
  return $f_sc_Set__equals__O__Z(this, that);
});
$p.bb = (function() {
  return "Set";
});
$p.p = (function() {
  return $f_sc_Iterable__toString__T(this);
});
$p.b = (function(v1) {
  return this.be(v1);
});
function $f_sc_Map__equals__O__Z($thiz, o) {
  if (($thiz === o)) {
    return true;
  } else if ($is_sc_Map(o)) {
    if (($thiz.aJ() === o.aJ())) {
      try {
        return $thiz.eR(new $c_sr_AbstractFunction1_$$Lambda$7afc3dd0acc1681fb022ef921c83979087aaa919(((map$1) => ((kv$2) => $m_sr_BoxesRunTime$().k(map$1.cT(kv$2.b8, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => $m_sc_Map$().lS.L()))), kv$2.aW)))(o)));
      } catch (e) {
        if (false) {
          return false;
        } else {
          throw e;
        }
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function $is_sc_Map(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.a8)));
}
function $isArrayOf_sc_Map(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.a8)));
}
/** @constructor */
function $c_Lcom_raquo_airstream_combine_CombineSignalN(parents, combinator) {
  this.jD = null;
  this.jC = false;
  this.jE = null;
  this.hf = 0;
  this.jA = null;
  this.jB = null;
  this.jF = false;
  this.hg = null;
  this.jx = null;
  this.jy = false;
  this.f3 = null;
  this.jz = null;
  this.hi = 0;
  this.hh = null;
  this.f3 = parents;
  this.jz = combinator;
  this.jD = (void 0);
  $f_Lcom_raquo_airstream_core_BaseObservable__$init$__V(this);
  this.hf = 0;
  $f_Lcom_raquo_airstream_core_WritableObservable__$init$__V(this);
  this.hg = (void 0);
  this.hi = ((1 + $m_Lcom_raquo_airstream_core_Protected$().qg(0, parents)) | 0);
  this.hh = parents.map(((parent) => $m_Lcom_raquo_airstream_common_InternalParentObserver$().pv(parent, new $c_sjsr_AnonFunction2_$$Lambda$770e9b86e03b055b1d78d82135c9f39ea48d32d7(((_$1, trx) => {
    $f_Lcom_raquo_airstream_combine_CombineObservable__onInputsReady__Lcom_raquo_airstream_core_Transaction__V(this, trx);
  })))));
}
$p = $c_Lcom_raquo_airstream_combine_CombineSignalN.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_combine_CombineSignalN;
/** @constructor */
function $h_Lcom_raquo_airstream_combine_CombineSignalN() {
}
$h_Lcom_raquo_airstream_combine_CombineSignalN.prototype = $p;
$p.eg = (function() {
  return this.jD;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.h1 = (function() {
  return this.jC;
});
$p.h4 = (function() {
  return this.jE;
});
$p.g3 = (function(x$1) {
  this.jC = x$1;
});
$p.h5 = (function(x$1) {
  this.jE = x$1;
});
$p.l = (function(obj) {
  return (this === obj);
});
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
$p.eO = (function() {
  return this.hf;
});
$p.gP = (function(x$1) {
  this.hf = x$1;
});
$p.cd = (function() {
  return this;
});
$p.eQ = (function() {
  return this.jA;
});
$p.eT = (function() {
  return this.jB;
});
$p.jw = (function() {
  return this.jF;
});
$p.gc = (function(x$1) {
  this.jF = x$1;
});
$p.iG = (function(x$0) {
  this.jA = x$0;
});
$p.iH = (function(x$0) {
  this.jB = x$0;
});
$p.h3 = (function() {
  return this.hg;
});
$p.jf = (function(x$1) {
  this.hg = x$1;
});
$p.eZ = (function() {
  return $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try(this);
});
$p.mr = (function() {
  if ((!this.jy)) {
    this.jx = $f_Lcom_raquo_airstream_common_MultiParentSignal___parentLastUpdateIds__Lcom_raquo_ew_JsArray(this);
    this.jy = true;
  }
  return this.jx;
});
$p.jl = (function() {
  $f_Lcom_raquo_airstream_common_MultiParentSignal__onWillStart__V(this);
});
$p.jj = (function() {
  $f_Lcom_raquo_airstream_combine_CombineObservable__onStart__V(this);
});
$p.jk = (function() {
  $f_Lcom_raquo_airstream_combine_CombineObservable__onStop__V(this);
});
$p.hc = (function() {
  return this.hi;
});
$p.iJ = (function() {
  return $m_Lcom_raquo_airstream_combine_CombineObservable$().q3(this.f3.map(((_$2) => _$2.eZ())), this.jz);
});
$p.gW = (function() {
  return this.iJ();
});
var $d_Lcom_raquo_airstream_combine_CombineSignalN = new $TypeData().i($c_Lcom_raquo_airstream_combine_CombineSignalN, "com.raquo.airstream.combine.CombineSignalN", ({
  cs: 1,
  ap: 1,
  a4: 1,
  at: 1,
  au: 1,
  aq: 1,
  aw: 1,
  aE: 1,
  aF: 1,
  cy: 1,
  cJ: 1,
  cq: 1
}));
/** @constructor */
function $c_Lcom_raquo_airstream_misc_MapSignal(parent, project, recover) {
  this.jT = null;
  this.jS = false;
  this.jU = null;
  this.hq = 0;
  this.jQ = null;
  this.jR = null;
  this.jW = false;
  this.hr = null;
  this.hs = false;
  this.gg = 0;
  this.cW = null;
  this.ht = null;
  this.hu = null;
  this.jV = 0;
  this.cW = parent;
  this.ht = project;
  this.hu = recover;
  this.jT = (void 0);
  $f_Lcom_raquo_airstream_core_BaseObservable__$init$__V(this);
  this.hq = 0;
  $f_Lcom_raquo_airstream_core_WritableObservable__$init$__V(this);
  this.hr = (void 0);
  $f_Lcom_raquo_airstream_common_SingleParentSignal__$init$__V(this);
  this.jV = ((1 + parent.hc()) | 0);
}
$p = $c_Lcom_raquo_airstream_misc_MapSignal.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_airstream_misc_MapSignal;
/** @constructor */
function $h_Lcom_raquo_airstream_misc_MapSignal() {
}
$h_Lcom_raquo_airstream_misc_MapSignal.prototype = $p;
$p.eg = (function() {
  return this.jT;
});
$p.ea = (function() {
  return $f_Lcom_raquo_airstream_core_Named__defaultDisplayName__T(this);
});
$p.p = (function() {
  return $f_Lcom_raquo_airstream_core_Named__displayName__T(this);
});
$p.h1 = (function() {
  return this.jS;
});
$p.h4 = (function() {
  return this.jU;
});
$p.g3 = (function(x$1) {
  this.jS = x$1;
});
$p.h5 = (function(x$1) {
  this.jU = x$1;
});
$p.l = (function(obj) {
  return (this === obj);
});
$p.r = (function() {
  return $systemIdentityHashCode(this);
});
$p.eO = (function() {
  return this.hq;
});
$p.gP = (function(x$1) {
  this.hq = x$1;
});
$p.cd = (function() {
  return this;
});
$p.eQ = (function() {
  return this.jQ;
});
$p.eT = (function() {
  return this.jR;
});
$p.jw = (function() {
  return this.jW;
});
$p.gc = (function(x$1) {
  this.jW = x$1;
});
$p.iG = (function(x$0) {
  this.jQ = x$0;
});
$p.iH = (function(x$0) {
  this.jR = x$0;
});
$p.h3 = (function() {
  return this.hr;
});
$p.jf = (function(x$1) {
  this.hr = x$1;
});
$p.eZ = (function() {
  return $f_Lcom_raquo_airstream_core_WritableSignal__tryNow__s_util_Try(this);
});
$p.jl = (function() {
  $f_Lcom_raquo_airstream_common_SingleParentSignal__onWillStart__V(this);
});
$p.jj = (function() {
  $f_Lcom_raquo_airstream_common_SingleParentSignal__onStart__V(this);
});
$p.jk = (function() {
  $f_Lcom_raquo_airstream_common_SingleParentSignal__onStop__V(this);
});
$p.hc = (function() {
  return this.jV;
});
$p.nn = (function(nextParentValue, transaction) {
  $f_Lcom_raquo_airstream_common_SingleParentSignal__onTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V(this, nextParentValue, transaction);
  nextParentValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextError) => {
    var this$2 = this.hu;
    if (this$2.c()) {
      $f_Lcom_raquo_airstream_core_WritableSignal__fireError__jl_Throwable__Lcom_raquo_airstream_core_Transaction__V(this, nextError, transaction);
    } else {
      var x0 = this$2.y();
      try {
        var $x_1 = new $c_s_util_Success(x0.cQ(nextError, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$1) => null))));
      } catch (e) {
        var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
        matchResult1: {
          var $x_1;
          var x2 = $m_s_util_control_NonFatal$().gb(e$2);
          if ((!x2.c())) {
            var $x_1 = new $c_s_util_Failure(x2.y());
            break matchResult1;
          }
          throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
        }
      }
      $x_1.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextError$3$3) => ((tryError) => {
        $f_Lcom_raquo_airstream_core_WritableSignal__fireError__jl_Throwable__Lcom_raquo_airstream_core_Transaction__V(this, new $c_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError(tryError, nextError$3$3), transaction);
      }))(nextError)), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextError$3$4) => ((nextValue) => {
        if ((nextValue === null)) {
          $f_Lcom_raquo_airstream_core_WritableSignal__fireError__jl_Throwable__Lcom_raquo_airstream_core_Transaction__V(this, nextError$3$4, transaction);
        } else if ((!nextValue.c())) {
          $f_Lcom_raquo_airstream_core_WritableSignal__fireValue__O__Lcom_raquo_airstream_core_Transaction__V(this, nextValue.y(), transaction);
        }
      }))(nextError)));
    }
  })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$3) => {
    $f_Lcom_raquo_airstream_core_WritableSignal__fireTry__s_util_Try__Lcom_raquo_airstream_core_Transaction__V(this, nextParentValue.je(this.ht), transaction);
  })));
});
$p.gW = (function() {
  var originalValue = this.cW.eZ().je(this.ht);
  return originalValue.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextError) => {
    var this$2 = this.hu;
    if (this$2.c()) {
      return originalValue;
    } else {
      var x0 = this$2.y();
      try {
        var $x_1 = new $c_s_util_Success(x0.cQ(nextError, new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$4) => null))));
      } catch (e) {
        var e$2 = ((e instanceof $c_jl_Throwable) ? e : new $c_sjs_js_JavaScriptException(e));
        matchResult1: {
          var $x_1;
          var x2 = $m_s_util_control_NonFatal$().gb(e$2);
          if ((!x2.c())) {
            var $x_1 = new $c_s_util_Failure(x2.y());
            break matchResult1;
          }
          throw ((e$2 instanceof $c_sjs_js_JavaScriptException) ? e$2.Z : e$2);
        }
      }
      return $x_1.cR(new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextError$7$3) => ((tryError) => new $c_s_util_Failure(new $c_Lcom_raquo_airstream_core_AirstreamError$ErrorHandlingError(tryError, nextError$7$3))))(nextError)), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((nextValue) => {
        if ((nextValue === null)) {
          return originalValue;
        } else {
          var this$10 = (nextValue.c() ? $m_s_None$() : new $c_s_Some(new $c_s_util_Success(nextValue.y())));
          return (this$10.c() ? originalValue : this$10.y());
        }
      })));
    }
  })), new $c_sjsr_AnonFunction1_$$Lambda$412915ce24663401f4bc24349a746e1dbd693dc1(((_$6) => originalValue)));
});
var $d_Lcom_raquo_airstream_misc_MapSignal = new $TypeData().i($c_Lcom_raquo_airstream_misc_MapSignal, "com.raquo.airstream.misc.MapSignal", ({
  cO: 1,
  ap: 1,
  a4: 1,
  at: 1,
  au: 1,
  aq: 1,
  aw: 1,
  aE: 1,
  aF: 1,
  aD: 1,
  b0: 1,
  cz: 1
}));
/** @constructor */
function $c_sc_AbstractSeq() {
}
$p = $c_sc_AbstractSeq.prototype = new $h_sc_AbstractIterable();
$p.constructor = $c_sc_AbstractSeq;
/** @constructor */
function $h_sc_AbstractSeq() {
}
$h_sc_AbstractSeq.prototype = $p;
$p.cQ = (function(x, default$1) {
  return $f_s_PartialFunction__applyOrElse__O__F1__O(this, x, default$1);
});
$p.c7 = (function(f) {
  return $f_sc_SeqOps__distinctBy__F1__O(this, f);
});
$p.j9 = (function(idx) {
  return $f_sc_SeqOps__isDefinedAt__I__Z(this, idx);
});
$p.b2 = (function(len) {
  return $f_sc_IterableOps__sizeCompare__I__I(this, len);
});
$p.c = (function() {
  return $f_sc_SeqOps__isEmpty__Z(this);
});
$p.eY = (function(that) {
  return $f_sc_SeqOps__sameElements__sc_IterableOnce__Z(this, that);
});
$p.gV = (function(that) {
  return true;
});
$p.l = (function(o) {
  return $f_sc_Seq__equals__O__Z(this, o);
});
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().nB(this);
});
$p.p = (function() {
  return $f_sc_Iterable__toString__T(this);
});
$p.c9 = (function(x) {
  return this.j9((x | 0));
});
/** @constructor */
function $c_sc_AbstractSeqView() {
}
$p = $c_sc_AbstractSeqView.prototype = new $h_sc_AbstractView();
$p.constructor = $c_sc_AbstractSeqView;
/** @constructor */
function $h_sc_AbstractSeqView() {
}
$h_sc_AbstractSeqView.prototype = $p;
$p.c7 = (function(f) {
  return $f_sc_SeqOps__distinctBy__F1__O(this, f);
});
$p.b2 = (function(len) {
  return $f_sc_IterableOps__sizeCompare__I__I(this, len);
});
$p.c = (function() {
  return $f_sc_SeqOps__isEmpty__Z(this);
});
$p.ee = (function(f) {
  return $ct_sc_SeqView$Map__sc_SeqOps__F1__(new $c_sc_SeqView$Map(), this, f);
});
$p.bb = (function() {
  return "SeqView";
});
$p.K = (function(f) {
  return this.ee(f);
});
function $is_sc_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.q)));
}
function $isArrayOf_sc_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.q)));
}
function $is_sc_LinearSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.as)));
}
function $isArrayOf_sc_LinearSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.as)));
}
function $f_scm_CheckedIndexedSeqView__iterator__sc_Iterator($thiz) {
  return new $c_scm_CheckedIndexedSeqView$CheckedIterator($thiz, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => ($thiz.fE.L() | 0))));
}
function $f_Lcom_raquo_laminar_api_Laminar__$init$__V($thiz) {
  $thiz.nO = $m_Lcom_raquo_laminar_receivers_ChildReceiver$();
}
/** @constructor */
function $c_sc_AbstractMap() {
}
$p = $c_sc_AbstractMap.prototype = new $h_sc_AbstractIterable();
$p.constructor = $c_sc_AbstractMap;
/** @constructor */
function $h_sc_AbstractMap() {
}
$h_sc_AbstractMap.prototype = $p;
$p.cQ = (function(x, default$1) {
  return $f_sc_MapOps__applyOrElse__O__F1__O(this, x, default$1);
});
$p.ec = (function(f) {
  $f_sc_MapOps__foreachEntry__F2__V(this, f);
});
$p.c9 = (function(key) {
  return this.be(key);
});
$p.dz = (function(sb, start, sep, end) {
  return $f_sc_MapOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, sb, start, sep, end);
});
$p.g1 = (function(coll) {
  return this.nh().aa(coll);
});
$p.l = (function(o) {
  return $f_sc_Map__equals__O__Z(this, o);
});
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().qd(this);
});
$p.bb = (function() {
  return "Map";
});
$p.p = (function() {
  return $f_sc_Iterable__toString__T(this);
});
function $ct_sc_SeqView$Id__sc_SeqOps__($thiz, underlying) {
  $thiz.dY = underlying;
  return $thiz;
}
/** @constructor */
function $c_sc_SeqView$Id() {
  this.dY = null;
}
$p = $c_sc_SeqView$Id.prototype = new $h_sc_AbstractSeqView();
$p.constructor = $c_sc_SeqView$Id;
/** @constructor */
function $h_sc_SeqView$Id() {
}
$h_sc_SeqView$Id.prototype = $p;
$p.q = (function(idx) {
  return this.dY.q(idx);
});
$p.m = (function() {
  return this.dY.m();
});
$p.h = (function() {
  return this.dY.h();
});
$p.u = (function() {
  return this.dY.u();
});
$p.c = (function() {
  return this.dY.c();
});
var $d_sc_SeqView$Id = new $TypeData().i($c_sc_SeqView$Id, "scala.collection.SeqView$Id", ({
  bA: 1,
  aL: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1
}));
function $ct_sc_SeqView$Map__sc_SeqOps__F1__($thiz, underlying, f) {
  $thiz.ft = underlying;
  $thiz.gA = f;
  $ct_sc_View$Map__sc_IterableOps__F1__($thiz, underlying, f);
  return $thiz;
}
/** @constructor */
function $c_sc_SeqView$Map() {
  this.dZ = null;
  this.fv = null;
  this.ft = null;
  this.gA = null;
}
$p = $c_sc_SeqView$Map.prototype = new $h_sc_View$Map();
$p.constructor = $c_sc_SeqView$Map;
/** @constructor */
function $h_sc_SeqView$Map() {
}
$h_sc_SeqView$Map.prototype = $p;
$p.c7 = (function(f) {
  return $f_sc_SeqOps__distinctBy__F1__O(this, f);
});
$p.b2 = (function(len) {
  return $f_sc_IterableOps__sizeCompare__I__I(this, len);
});
$p.c = (function() {
  return $f_sc_SeqOps__isEmpty__Z(this);
});
$p.ee = (function(f) {
  return $ct_sc_SeqView$Map__sc_SeqOps__F1__(new $c_sc_SeqView$Map(), this, f);
});
$p.bb = (function() {
  return "SeqView";
});
$p.q = (function(idx) {
  return this.gA.b(this.ft.q(idx));
});
$p.m = (function() {
  return this.ft.m();
});
$p.K = (function(f) {
  return this.ee(f);
});
var $d_sc_SeqView$Map = new $TypeData().i($c_sc_SeqView$Map, "scala.collection.SeqView$Map", ({
  aP: 1,
  az: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1
}));
/** @constructor */
function $c_Lcom_raquo_laminar_api_package$$anon$1() {
  this.kt = null;
  this.ku = false;
  this.kH = null;
  this.kI = false;
  this.kv = null;
  this.kw = false;
  this.km = null;
  this.kn = false;
  this.kr = null;
  this.ks = false;
  this.kJ = null;
  this.kK = false;
  this.kx = null;
  this.ky = false;
  this.kz = null;
  this.kA = false;
  this.kP = null;
  this.kQ = false;
  this.kN = null;
  this.kO = false;
  this.ko = null;
  this.kp = false;
  this.kR = null;
  this.kS = false;
  this.kD = null;
  this.kE = false;
  this.kB = null;
  this.kC = false;
  this.kF = null;
  this.kG = false;
  this.kk = null;
  this.kl = false;
  this.kq = null;
  this.dQ = null;
  this.fd = null;
  this.nN = null;
  this.ki = null;
  this.kj = false;
  this.kL = null;
  this.kM = false;
  this.nO = null;
  $f_Lcom_raquo_laminar_defs_complex_ComplexHtmlKeys__$init$__V(this);
  $f_Lcom_raquo_laminar_api_MountHooks__$init$__V(this);
  $f_Lcom_raquo_laminar_api_AirstreamAliases__$init$__V(this);
  $f_Lcom_raquo_laminar_api_LaminarAliases__$init$__V(this);
  $f_Lcom_raquo_laminar_api_Laminar__$init$__V(this);
}
$p = $c_Lcom_raquo_laminar_api_package$$anon$1.prototype = new $h_O();
$p.constructor = $c_Lcom_raquo_laminar_api_package$$anon$1;
/** @constructor */
function $h_Lcom_raquo_laminar_api_package$$anon$1() {
}
$h_Lcom_raquo_laminar_api_package$$anon$1.prototype = $p;
$p.pG = (function() {
  if ((!this.ku)) {
    this.kt = new $c_Lcom_raquo_laminar_tags_HtmlTag("h2", false);
    this.ku = true;
  }
  return this.kt;
});
$p.jr = (function() {
  if ((!this.kI)) {
    this.kH = new $c_Lcom_raquo_laminar_tags_HtmlTag("span", false);
    this.kI = true;
  }
  return this.kH;
});
$p.pP = (function() {
  if ((!this.kw)) {
    this.kv = new $c_Lcom_raquo_laminar_tags_HtmlTag("input", true);
    this.kw = true;
  }
  return this.kv;
});
$p.oI = (function() {
  if ((!this.kn)) {
    this.km = new $c_Lcom_raquo_laminar_tags_HtmlTag("button", false);
    this.kn = true;
  }
  return this.km;
});
$p.fY = (function() {
  if ((!this.ks)) {
    this.kr = new $c_Lcom_raquo_laminar_tags_HtmlTag("div", false);
    this.ks = true;
  }
  return this.kr;
});
$p.qX = (function() {
  if ((!this.kK)) {
    this.kJ = new $c_Lcom_raquo_laminar_tags_HtmlTag("style", false);
    this.kK = true;
  }
  return this.kJ;
});
$p.qf = (function() {
  if ((!this.ky)) {
    this.kx = new $c_Lcom_raquo_laminar_keys_HtmlAttr("max", $m_Lcom_raquo_laminar_codecs_package$().dR);
    this.ky = true;
  }
  return this.kx;
});
$p.qi = (function() {
  if ((!this.kA)) {
    this.kz = new $c_Lcom_raquo_laminar_keys_HtmlAttr("min", $m_Lcom_raquo_laminar_codecs_package$().dR);
    this.kA = true;
  }
  return this.kz;
});
$p.r7 = (function() {
  if ((!this.kQ)) {
    this.kP = new $c_Lcom_raquo_laminar_keys_HtmlAttr("type", $m_Lcom_raquo_laminar_codecs_package$().dR);
    this.kQ = true;
  }
  return this.kP;
});
$p.nI = (function() {
  if ((!this.kO)) {
    this.kN = this.r7();
    this.kO = true;
  }
  return this.kN;
});
$p.oJ = (function() {
  if ((!this.kp)) {
    this.ko = new $c_Lcom_raquo_laminar_keys_HtmlProp("checked", $m_Lcom_raquo_laminar_codecs_package$().kT);
    this.kp = true;
  }
  return this.ko;
});
$p.jv = (function() {
  if ((!this.kS)) {
    this.kR = new $c_Lcom_raquo_laminar_keys_HtmlProp("value", $m_Lcom_raquo_laminar_codecs_package$().dR);
    this.kS = true;
  }
  return this.kR;
});
$p.nl = (function() {
  if ((!this.kE)) {
    this.kD = new $c_Lcom_raquo_laminar_keys_EventProp("click");
    this.kE = true;
  }
  return this.kD;
});
$p.qr = (function() {
  if ((!this.kC)) {
    this.kB = new $c_Lcom_raquo_laminar_keys_EventProp("change");
    this.kC = true;
  }
  return this.kB;
});
$p.h8 = (function() {
  if ((!this.kG)) {
    this.kF = new $c_Lcom_raquo_laminar_keys_EventProp("input");
    this.kG = true;
  }
  return this.kF;
});
$p.oC = (function() {
  if ((!this.kl)) {
    this.kk = new $c_Lcom_raquo_laminar_defs_styles_StyleProps$$anon$2("background-color");
    this.kl = true;
  }
  return this.kk;
});
$p.oe = (function() {
  if ((!this.kj)) {
    this.ki = new $c_Lcom_raquo_laminar_keys_CompositeKey$CompositeValueMappers$StringValueMapper$(this);
    this.kj = true;
  }
  return this.ki;
});
$p.r0 = (function() {
  if ((!this.kM)) {
    this.kL = new $c_Lcom_raquo_laminar_api_Laminar$svg$(this);
    this.kM = true;
  }
  return this.kL;
});
var $d_Lcom_raquo_laminar_api_package$$anon$1 = new $TypeData().i($c_Lcom_raquo_laminar_api_package$$anon$1, "com.raquo.laminar.api.package$$anon$1", ({
  dg: 1,
  dv: 1,
  dj: 1,
  dp: 1,
  dn: 1,
  dq: 1,
  dl: 1,
  de: 1,
  da: 1,
  dd: 1,
  b8: 1,
  ba: 1,
  b7: 1,
  db: 1
}));
function $is_sci_Map(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.a9)));
}
function $isArrayOf_sci_Map(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.a9)));
}
/** @constructor */
function $c_sc_AbstractIndexedSeqView() {
}
$p = $c_sc_AbstractIndexedSeqView.prototype = new $h_sc_AbstractSeqView();
$p.constructor = $c_sc_AbstractIndexedSeqView;
/** @constructor */
function $h_sc_AbstractIndexedSeqView() {
}
$h_sc_AbstractIndexedSeqView.prototype = $p;
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.bb = (function() {
  return "IndexedSeqView";
});
/** @constructor */
function $c_sc_IndexedSeqView$Id(underlying) {
  this.dY = null;
  $ct_sc_SeqView$Id__sc_SeqOps__(this, underlying);
}
$p = $c_sc_IndexedSeqView$Id.prototype = new $h_sc_SeqView$Id();
$p.constructor = $c_sc_IndexedSeqView$Id;
/** @constructor */
function $h_sc_IndexedSeqView$Id() {
}
$h_sc_IndexedSeqView$Id.prototype = $p;
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.h = (function() {
  return $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), this);
});
$p.bb = (function() {
  return "IndexedSeqView";
});
$p.K = (function(f) {
  return $ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__(new $c_sc_IndexedSeqView$Map(), this, f);
});
$p.ee = (function(f) {
  return $ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__(new $c_sc_IndexedSeqView$Map(), this, f);
});
var $d_sc_IndexedSeqView$Id = new $TypeData().i($c_sc_IndexedSeqView$Id, "scala.collection.IndexedSeqView$Id", ({
  fK: 1,
  bA: 1,
  aL: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1,
  o: 1,
  ay: 1
}));
function $ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__($thiz, underlying, f) {
  $ct_sc_SeqView$Map__sc_SeqOps__F1__($thiz, underlying, f);
  return $thiz;
}
/** @constructor */
function $c_sc_IndexedSeqView$Map() {
  this.dZ = null;
  this.fv = null;
  this.ft = null;
  this.gA = null;
}
$p = $c_sc_IndexedSeqView$Map.prototype = new $h_sc_SeqView$Map();
$p.constructor = $c_sc_IndexedSeqView$Map;
/** @constructor */
function $h_sc_IndexedSeqView$Map() {
}
$h_sc_IndexedSeqView$Map.prototype = $p;
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.h = (function() {
  return $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), this);
});
$p.eU = (function(f) {
  return $ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__(new $c_sc_IndexedSeqView$Map(), this, f);
});
$p.bb = (function() {
  return "IndexedSeqView";
});
$p.K = (function(f) {
  return this.eU(f);
});
$p.ee = (function(f) {
  return this.eU(f);
});
var $d_sc_IndexedSeqView$Map = new $TypeData().i($c_sc_IndexedSeqView$Map, "scala.collection.IndexedSeqView$Map", ({
  by: 1,
  aP: 1,
  az: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1,
  o: 1,
  ay: 1
}));
/** @constructor */
function $c_sci_AbstractSeq() {
}
$p = $c_sci_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$p.constructor = $c_sci_AbstractSeq;
/** @constructor */
function $h_sci_AbstractSeq() {
}
$h_sci_AbstractSeq.prototype = $p;
/** @constructor */
function $c_scm_ArrayBufferView(underlying, mutationCount) {
  this.iq = null;
  this.ip = null;
  this.iq = underlying;
  this.ip = mutationCount;
}
$p = $c_scm_ArrayBufferView.prototype = new $h_sc_AbstractIndexedSeqView();
$p.constructor = $c_scm_ArrayBufferView;
/** @constructor */
function $h_scm_ArrayBufferView() {
}
$h_scm_ArrayBufferView.prototype = $p;
$p.q = (function(n) {
  return this.iq.q(n);
});
$p.m = (function() {
  return this.iq.b0;
});
$p.bH = (function() {
  return "ArrayBufferView";
});
$p.h = (function() {
  return new $c_scm_CheckedIndexedSeqView$CheckedIterator(this, this.ip);
});
$p.eU = (function(f) {
  return new $c_scm_CheckedIndexedSeqView$Map(this, f, this.ip);
});
$p.K = (function(f) {
  return this.eU(f);
});
$p.ee = (function(f) {
  return this.eU(f);
});
var $d_scm_ArrayBufferView = new $TypeData().i($c_scm_ArrayBufferView, "scala.collection.mutable.ArrayBufferView", ({
  gY: 1,
  fD: 1,
  aL: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1,
  o: 1,
  ay: 1
}));
/** @constructor */
function $c_sci_AbstractMap() {
}
$p = $c_sci_AbstractMap.prototype = new $h_sc_AbstractMap();
$p.constructor = $c_sci_AbstractMap;
/** @constructor */
function $h_sci_AbstractMap() {
}
$h_sci_AbstractMap.prototype = $p;
$p.b1 = (function() {
  return $m_sci_Iterable$();
});
$p.nh = (function() {
  return $m_sci_Map$();
});
function $f_sci_IndexedSeq__canEqual__O__Z($thiz, that) {
  return ($is_sci_IndexedSeq(that) ? ($thiz.m() === that.m()) : true);
}
function $f_sci_IndexedSeq__sameElements__sc_IterableOnce__Z($thiz, o) {
  if ($is_sci_IndexedSeq(o)) {
    if (($thiz === o)) {
      return true;
    } else {
      var length = $thiz.m();
      var equal = (length === o.m());
      if (equal) {
        var index = 0;
        var a = $thiz.gT();
        var b = o.gT();
        var preferredLength = ((a < b) ? a : b);
        var hi = (length >> 31);
        var hi$1 = (preferredLength >> 31);
        var lo = (preferredLength << 1);
        var hi$2 = (((preferredLength >>> 31) | 0) | (hi$1 << 1));
        if (((hi === hi$2) ? ((length >>> 0) > (lo >>> 0)) : (hi > hi$2))) {
          var maxApplyCompare = preferredLength;
        } else {
          var maxApplyCompare = length;
        }
        while (((index < maxApplyCompare) && equal)) {
          equal = $m_sr_BoxesRunTime$().k($thiz.q(index), o.q(index));
          index = ((1 + index) | 0);
        }
        if (((index < length) && equal)) {
          var thisIt = $thiz.h().dF(index);
          var thatIt = o.h().dF(index);
          while ((equal && thisIt.j())) {
            equal = $m_sr_BoxesRunTime$().k(thisIt.i(), thatIt.i());
          }
        }
      }
      return equal;
    }
  } else {
    return $f_sc_SeqOps__sameElements__sc_IterableOnce__Z($thiz, o);
  }
}
function $is_sci_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.n.A)));
}
function $isArrayOf_sci_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.A)));
}
function $isArrayOf_sci_SeqMap$SeqMap1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gD)));
}
function $isArrayOf_sci_SeqMap$SeqMap2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gE)));
}
function $isArrayOf_sci_SeqMap$SeqMap3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gF)));
}
function $isArrayOf_sci_SeqMap$SeqMap4(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gG)));
}
/** @constructor */
function $c_scm_AbstractSeq() {
}
$p = $c_scm_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$p.constructor = $c_scm_AbstractSeq;
/** @constructor */
function $h_scm_AbstractSeq() {
}
$h_scm_AbstractSeq.prototype = $p;
/** @constructor */
function $c_scm_CheckedIndexedSeqView$Map(underlying, f, mutationCount) {
  this.dZ = null;
  this.fv = null;
  this.ft = null;
  this.gA = null;
  this.fE = null;
  this.fE = mutationCount;
  $ct_sc_IndexedSeqView$Map__sc_IndexedSeqOps__F1__(this, underlying, f);
}
$p = $c_scm_CheckedIndexedSeqView$Map.prototype = new $h_sc_IndexedSeqView$Map();
$p.constructor = $c_scm_CheckedIndexedSeqView$Map;
/** @constructor */
function $h_scm_CheckedIndexedSeqView$Map() {
}
$h_scm_CheckedIndexedSeqView$Map.prototype = $p;
$p.h = (function() {
  return $f_scm_CheckedIndexedSeqView__iterator__sc_Iterator(this);
});
$p.eU = (function(f) {
  return new $c_scm_CheckedIndexedSeqView$Map(this, f, this.fE);
});
$p.K = (function(f) {
  return new $c_scm_CheckedIndexedSeqView$Map(this, f, this.fE);
});
$p.ee = (function(f) {
  return new $c_scm_CheckedIndexedSeqView$Map(this, f, this.fE);
});
var $d_scm_CheckedIndexedSeqView$Map = new $TypeData().i($c_scm_CheckedIndexedSeqView$Map, "scala.collection.mutable.CheckedIndexedSeqView$Map", ({
  h7: 1,
  by: 1,
  aP: 1,
  az: 1,
  a6: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  a: 1,
  Z: 1,
  k: 1,
  ak: 1,
  o: 1,
  ay: 1,
  h5: 1
}));
/** @constructor */
function $c_sci_Map$EmptyMap$() {
}
$p = $c_sci_Map$EmptyMap$.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_Map$EmptyMap$;
/** @constructor */
function $h_sci_Map$EmptyMap$() {
}
$h_sci_Map$EmptyMap$.prototype = $p;
$p.aJ = (function() {
  return 0;
});
$p.u = (function() {
  return 0;
});
$p.c = (function() {
  return true;
});
$p.iE = (function(key) {
  throw new $c_ju_NoSuchElementException(("key not found: " + key));
});
$p.be = (function(key) {
  return false;
});
$p.cT = (function(key, default$1) {
  return default$1.L();
});
$p.h = (function() {
  return $m_sc_Iterator$().P;
});
$p.b = (function(key) {
  this.iE(key);
});
$p.dM = (function(key, value) {
  return new $c_sci_Map$Map1(key, value);
});
var $d_sci_Map$EmptyMap$ = new $TypeData().i($c_sci_Map$EmptyMap$, "scala.collection.immutable.Map$EmptyMap$", ({
  gp: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  a: 1
}));
var $n_sci_Map$EmptyMap$;
function $m_sci_Map$EmptyMap$() {
  if ((!$n_sci_Map$EmptyMap$)) {
    $n_sci_Map$EmptyMap$ = new $c_sci_Map$EmptyMap$();
  }
  return $n_sci_Map$EmptyMap$;
}
/** @constructor */
function $c_sci_Map$Map1(key1, value1) {
  this.cl = null;
  this.e2 = null;
  this.cl = key1;
  this.e2 = value1;
}
$p = $c_sci_Map$Map1.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_Map$Map1;
/** @constructor */
function $h_sci_Map$Map1() {
}
$h_sci_Map$Map1.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.aJ = (function() {
  return 1;
});
$p.u = (function() {
  return 1;
});
$p.c = (function() {
  return false;
});
$p.b = (function(key) {
  if ($m_sr_BoxesRunTime$().k(key, this.cl)) {
    return this.e2;
  } else {
    throw new $c_ju_NoSuchElementException(("key not found: " + key));
  }
});
$p.be = (function(key) {
  return $m_sr_BoxesRunTime$().k(key, this.cl);
});
$p.cT = (function(key, default$1) {
  return ($m_sr_BoxesRunTime$().k(key, this.cl) ? this.e2 : default$1.L());
});
$p.h = (function() {
  return new $c_sc_Iterator$$anon$20(new $c_T2(this.cl, this.e2));
});
$p.ej = (function(key, value) {
  return ($m_sr_BoxesRunTime$().k(key, this.cl) ? new $c_sci_Map$Map1(this.cl, value) : new $c_sci_Map$Map2(this.cl, this.e2, key, value));
});
$p.eR = (function(p) {
  return (!(!p.b(new $c_T2(this.cl, this.e2))));
});
$p.r = (function() {
  var a = 0;
  var b = 0;
  var c = 1;
  var h = $m_s_util_hashing_MurmurHash3$().ce(this.cl, this.e2);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().dy;
  h = $m_s_util_hashing_MurmurHash3$().v(h, a);
  h = $m_s_util_hashing_MurmurHash3$().v(h, b);
  h = $m_s_util_hashing_MurmurHash3$().cV(h, c);
  return $m_s_util_hashing_MurmurHash3$().ay(h, 1);
});
$p.dM = (function(key, value) {
  return this.ej(key, value);
});
function $isArrayOf_sci_Map$Map1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bS)));
}
var $d_sci_Map$Map1 = new $TypeData().i($c_sci_Map$Map1, "scala.collection.immutable.Map$Map1", ({
  bS: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  l: 1,
  a: 1
}));
/** @constructor */
function $c_sci_Map$Map2(key1, value1, key2, value2) {
  this.c0 = null;
  this.de = null;
  this.c1 = null;
  this.df = null;
  this.c0 = key1;
  this.de = value1;
  this.c1 = key2;
  this.df = value2;
}
$p = $c_sci_Map$Map2.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_Map$Map2;
/** @constructor */
function $h_sci_Map$Map2() {
}
$h_sci_Map$Map2.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.aJ = (function() {
  return 2;
});
$p.u = (function() {
  return 2;
});
$p.c = (function() {
  return false;
});
$p.b = (function(key) {
  if ($m_sr_BoxesRunTime$().k(key, this.c0)) {
    return this.de;
  } else if ($m_sr_BoxesRunTime$().k(key, this.c1)) {
    return this.df;
  } else {
    throw new $c_ju_NoSuchElementException(("key not found: " + key));
  }
});
$p.be = (function(key) {
  return ($m_sr_BoxesRunTime$().k(key, this.c0) || $m_sr_BoxesRunTime$().k(key, this.c1));
});
$p.cT = (function(key, default$1) {
  return ($m_sr_BoxesRunTime$().k(key, this.c0) ? this.de : ($m_sr_BoxesRunTime$().k(key, this.c1) ? this.df : default$1.L()));
});
$p.h = (function() {
  return new $c_sci_Map$Map2$$anon$1(this);
});
$p.ej = (function(key, value) {
  return ($m_sr_BoxesRunTime$().k(key, this.c0) ? new $c_sci_Map$Map2(this.c0, value, this.c1, this.df) : ($m_sr_BoxesRunTime$().k(key, this.c1) ? new $c_sci_Map$Map2(this.c0, this.de, this.c1, value) : new $c_sci_Map$Map3(this.c0, this.de, this.c1, this.df, key, value)));
});
$p.eR = (function(p) {
  return ((!(!p.b(new $c_T2(this.c0, this.de)))) && (!(!p.b(new $c_T2(this.c1, this.df)))));
});
$p.r = (function() {
  var a = 0;
  var b = 0;
  var c = 1;
  var h = $m_s_util_hashing_MurmurHash3$().ce(this.c0, this.de);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.c1, this.df);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().dy;
  h = $m_s_util_hashing_MurmurHash3$().v(h, a);
  h = $m_s_util_hashing_MurmurHash3$().v(h, b);
  h = $m_s_util_hashing_MurmurHash3$().cV(h, c);
  return $m_s_util_hashing_MurmurHash3$().ay(h, 2);
});
$p.dM = (function(key, value) {
  return this.ej(key, value);
});
function $isArrayOf_sci_Map$Map2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bT)));
}
var $d_sci_Map$Map2 = new $TypeData().i($c_sci_Map$Map2, "scala.collection.immutable.Map$Map2", ({
  bT: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  l: 1,
  a: 1
}));
/** @constructor */
function $c_sci_Map$Map3(key1, value1, key2, value2, key3, value3) {
  this.bO = null;
  this.cD = null;
  this.bP = null;
  this.cE = null;
  this.bQ = null;
  this.cF = null;
  this.bO = key1;
  this.cD = value1;
  this.bP = key2;
  this.cE = value2;
  this.bQ = key3;
  this.cF = value3;
}
$p = $c_sci_Map$Map3.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_Map$Map3;
/** @constructor */
function $h_sci_Map$Map3() {
}
$h_sci_Map$Map3.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.aJ = (function() {
  return 3;
});
$p.u = (function() {
  return 3;
});
$p.c = (function() {
  return false;
});
$p.b = (function(key) {
  if ($m_sr_BoxesRunTime$().k(key, this.bO)) {
    return this.cD;
  } else if ($m_sr_BoxesRunTime$().k(key, this.bP)) {
    return this.cE;
  } else if ($m_sr_BoxesRunTime$().k(key, this.bQ)) {
    return this.cF;
  } else {
    throw new $c_ju_NoSuchElementException(("key not found: " + key));
  }
});
$p.be = (function(key) {
  return (($m_sr_BoxesRunTime$().k(key, this.bO) || $m_sr_BoxesRunTime$().k(key, this.bP)) || $m_sr_BoxesRunTime$().k(key, this.bQ));
});
$p.cT = (function(key, default$1) {
  return ($m_sr_BoxesRunTime$().k(key, this.bO) ? this.cD : ($m_sr_BoxesRunTime$().k(key, this.bP) ? this.cE : ($m_sr_BoxesRunTime$().k(key, this.bQ) ? this.cF : default$1.L())));
});
$p.h = (function() {
  return new $c_sci_Map$Map3$$anon$4(this);
});
$p.ej = (function(key, value) {
  return ($m_sr_BoxesRunTime$().k(key, this.bO) ? new $c_sci_Map$Map3(this.bO, value, this.bP, this.cE, this.bQ, this.cF) : ($m_sr_BoxesRunTime$().k(key, this.bP) ? new $c_sci_Map$Map3(this.bO, this.cD, this.bP, value, this.bQ, this.cF) : ($m_sr_BoxesRunTime$().k(key, this.bQ) ? new $c_sci_Map$Map3(this.bO, this.cD, this.bP, this.cE, this.bQ, value) : new $c_sci_Map$Map4(this.bO, this.cD, this.bP, this.cE, this.bQ, this.cF, key, value))));
});
$p.eR = (function(p) {
  return (((!(!p.b(new $c_T2(this.bO, this.cD)))) && (!(!p.b(new $c_T2(this.bP, this.cE))))) && (!(!p.b(new $c_T2(this.bQ, this.cF)))));
});
$p.r = (function() {
  var a = 0;
  var b = 0;
  var c = 1;
  var h = $m_s_util_hashing_MurmurHash3$().ce(this.bO, this.cD);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.bP, this.cE);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.bQ, this.cF);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().dy;
  h = $m_s_util_hashing_MurmurHash3$().v(h, a);
  h = $m_s_util_hashing_MurmurHash3$().v(h, b);
  h = $m_s_util_hashing_MurmurHash3$().cV(h, c);
  return $m_s_util_hashing_MurmurHash3$().ay(h, 3);
});
$p.dM = (function(key, value) {
  return this.ej(key, value);
});
function $isArrayOf_sci_Map$Map3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bU)));
}
var $d_sci_Map$Map3 = new $TypeData().i($c_sci_Map$Map3, "scala.collection.immutable.Map$Map3", ({
  bU: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  l: 1,
  a: 1
}));
/** @constructor */
function $c_sci_Map$Map4(key1, value1, key2, value2, key3, value3, key4, value4) {
  this.br = null;
  this.c2 = null;
  this.bs = null;
  this.c3 = null;
  this.bt = null;
  this.c4 = null;
  this.bu = null;
  this.c5 = null;
  this.br = key1;
  this.c2 = value1;
  this.bs = key2;
  this.c3 = value2;
  this.bt = key3;
  this.c4 = value3;
  this.bu = key4;
  this.c5 = value4;
}
$p = $c_sci_Map$Map4.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_Map$Map4;
/** @constructor */
function $h_sci_Map$Map4() {
}
$h_sci_Map$Map4.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.aJ = (function() {
  return 4;
});
$p.u = (function() {
  return 4;
});
$p.c = (function() {
  return false;
});
$p.b = (function(key) {
  if ($m_sr_BoxesRunTime$().k(key, this.br)) {
    return this.c2;
  } else if ($m_sr_BoxesRunTime$().k(key, this.bs)) {
    return this.c3;
  } else if ($m_sr_BoxesRunTime$().k(key, this.bt)) {
    return this.c4;
  } else if ($m_sr_BoxesRunTime$().k(key, this.bu)) {
    return this.c5;
  } else {
    throw new $c_ju_NoSuchElementException(("key not found: " + key));
  }
});
$p.be = (function(key) {
  return ((($m_sr_BoxesRunTime$().k(key, this.br) || $m_sr_BoxesRunTime$().k(key, this.bs)) || $m_sr_BoxesRunTime$().k(key, this.bt)) || $m_sr_BoxesRunTime$().k(key, this.bu));
});
$p.cT = (function(key, default$1) {
  return ($m_sr_BoxesRunTime$().k(key, this.br) ? this.c2 : ($m_sr_BoxesRunTime$().k(key, this.bs) ? this.c3 : ($m_sr_BoxesRunTime$().k(key, this.bt) ? this.c4 : ($m_sr_BoxesRunTime$().k(key, this.bu) ? this.c5 : default$1.L()))));
});
$p.h = (function() {
  return new $c_sci_Map$Map4$$anon$7(this);
});
$p.ej = (function(key, value) {
  return ($m_sr_BoxesRunTime$().k(key, this.br) ? new $c_sci_Map$Map4(this.br, value, this.bs, this.c3, this.bt, this.c4, this.bu, this.c5) : ($m_sr_BoxesRunTime$().k(key, this.bs) ? new $c_sci_Map$Map4(this.br, this.c2, this.bs, value, this.bt, this.c4, this.bu, this.c5) : ($m_sr_BoxesRunTime$().k(key, this.bt) ? new $c_sci_Map$Map4(this.br, this.c2, this.bs, this.c3, this.bt, value, this.bu, this.c5) : ($m_sr_BoxesRunTime$().k(key, this.bu) ? new $c_sci_Map$Map4(this.br, this.c2, this.bs, this.c3, this.bt, this.c4, this.bu, value) : $m_sci_HashMap$().ih.f2(this.br, this.c2).f2(this.bs, this.c3).f2(this.bt, this.c4).f2(this.bu, this.c5).f2(key, value)))));
});
$p.eR = (function(p) {
  return ((((!(!p.b(new $c_T2(this.br, this.c2)))) && (!(!p.b(new $c_T2(this.bs, this.c3))))) && (!(!p.b(new $c_T2(this.bt, this.c4))))) && (!(!p.b(new $c_T2(this.bu, this.c5)))));
});
$p.oH = (function(builder) {
  return builder.e8(this.br, this.c2).e8(this.bs, this.c3).e8(this.bt, this.c4).e8(this.bu, this.c5);
});
$p.r = (function() {
  var a = 0;
  var b = 0;
  var c = 1;
  var h = $m_s_util_hashing_MurmurHash3$().ce(this.br, this.c2);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.bs, this.c3);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.bt, this.c4);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().ce(this.bu, this.c5);
  a = ((a + h) | 0);
  b = (b ^ h);
  c = Math.imul(c, (1 | h));
  h = $m_s_util_hashing_MurmurHash3$().dy;
  h = $m_s_util_hashing_MurmurHash3$().v(h, a);
  h = $m_s_util_hashing_MurmurHash3$().v(h, b);
  h = $m_s_util_hashing_MurmurHash3$().cV(h, c);
  return $m_s_util_hashing_MurmurHash3$().ay(h, 4);
});
$p.dM = (function(key, value) {
  return this.ej(key, value);
});
function $isArrayOf_sci_Map$Map4(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bV)));
}
var $d_sci_Map$Map4 = new $TypeData().i($c_sci_Map$Map4, "scala.collection.immutable.Map$Map4", ({
  bV: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  l: 1,
  a: 1
}));
function $isArrayOf_sci_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gb)));
}
/** @constructor */
function $c_scm_AbstractSet() {
}
$p = $c_scm_AbstractSet.prototype = new $h_sc_AbstractSet();
$p.constructor = $c_scm_AbstractSet;
/** @constructor */
function $h_scm_AbstractSet() {
}
$h_scm_AbstractSet.prototype = $p;
$p.aV = (function() {
  return this;
});
function $ct_sci_LazyList__O__($thiz, lazyState) {
  $thiz.aX = ((lazyState === $m_sci_LazyList$EmptyMarker$()) ? null : $m_sci_LazyList$Uninitialized$());
  $thiz.ck = ((lazyState === $m_sci_LazyList$EmptyMarker$()) ? null : lazyState);
  return $thiz;
}
function $ct_sci_LazyList__O__sci_LazyList__($thiz, head, tail) {
  $ct_sci_LazyList__O__($thiz, $m_sci_LazyList$EmptyMarker$());
  $thiz.aX = head;
  $thiz.ck = tail;
  return $thiz;
}
function $p_sci_LazyList__initState__V($thiz) {
  if (($thiz.aX === $m_sci_LazyList$Uninitialized$())) {
    if (($thiz.ck === $m_sci_LazyList$MidEvaluation$())) {
      throw $ct_jl_RuntimeException__T__(new $c_jl_RuntimeException(), "LazyList evaluation depends on its own result (self-reference); see docs for more info");
    }
    var fun = $thiz.ck;
    $thiz.ck = $m_sci_LazyList$MidEvaluation$();
    try {
      var l = $p_sci_LazyList__evaluated__sci_LazyList(fun.L());
    } finally {
      $thiz.ck = fun;
    }
    $thiz.ck = l.ck;
    $thiz.aX = l.aX;
  }
}
function $p_sci_LazyList__evaluated__sci_LazyList($thiz) {
  while (true) {
    if (($thiz.aX !== $m_sci_LazyList$Uninitialized$())) {
      return (($thiz.ck === null) ? $m_sci_LazyList$().F : $thiz);
    } else {
      $p_sci_LazyList__initState__V($thiz);
    }
  }
}
function $p_sci_LazyList__mapImpl__F1__sci_LazyList($thiz, f) {
  $m_sci_LazyList$();
  return $ct_sci_LazyList__O__(new $c_sci_LazyList(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => (($p_sci_LazyList__evaluated__sci_LazyList($thiz) === $m_sci_LazyList$().F) ? $m_sci_LazyList$().F : ($m_sci_LazyList$(), $ct_sci_LazyList__O__sci_LazyList__(new $c_sci_LazyList(), f.b($thiz.o()), $p_sci_LazyList__mapImpl__F1__sci_LazyList($thiz.aK(), f)))))));
}
function $p_sci_LazyList__addStringNoForce__jl_StringBuilder__T__T__T__jl_StringBuilder($thiz, b, start, sep, end) {
  b.n = (("" + b.n) + start);
  if (($thiz.aX === $m_sci_LazyList$Uninitialized$())) {
    b.n = (b.n + "<not computed>");
  } else if (($p_sci_LazyList__evaluated__sci_LazyList($thiz) !== $m_sci_LazyList$().F)) {
    var obj = $thiz.o();
    b.n = (("" + b.n) + obj);
    var cursor = $thiz;
    var scout = $thiz.aK();
    if ((cursor !== scout)) {
      cursor = scout;
      var this$1 = scout;
      if (((this$1.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this$1) !== $m_sci_LazyList$().F))) {
        scout = scout.aK();
        while (true) {
          if ((cursor !== scout)) {
            var this$2 = scout;
            var $x_1 = ((this$2.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this$2) !== $m_sci_LazyList$().F));
          } else {
            var $x_1 = false;
          }
          if ($x_1) {
            var c = cursor;
            b.n = (("" + b.n) + sep);
            var obj$1 = c.o();
            b.n = (("" + b.n) + obj$1);
            cursor = cursor.aK();
            scout = scout.aK();
            var this$3 = scout;
            if (((this$3.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this$3) !== $m_sci_LazyList$().F))) {
              scout = scout.aK();
            }
          } else {
            break;
          }
        }
      }
    }
    var this$4 = scout;
    if ((!((this$4.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this$4) !== $m_sci_LazyList$().F)))) {
      while ((cursor !== scout)) {
        var c$1 = cursor;
        b.n = (("" + b.n) + sep);
        var obj$2 = c$1.o();
        b.n = (("" + b.n) + obj$2);
        cursor = cursor.aK();
      }
      if ((!(cursor.aX !== $m_sci_LazyList$Uninitialized$()))) {
        b.n = (("" + b.n) + sep);
        b.n = (b.n + "<not computed>");
      }
    } else {
      if ((cursor !== $thiz)) {
        var runner = $thiz;
        while ((runner !== scout)) {
          runner = runner.aK();
          scout = scout.aK();
        }
        while (true) {
          var ct = cursor.aK();
          if ((ct !== scout)) {
            var c$2 = cursor;
            b.n = (("" + b.n) + sep);
            var obj$3 = c$2.o();
            b.n = (("" + b.n) + obj$3);
          }
          cursor = ct;
          if ((cursor !== scout)) {
          } else {
            break;
          }
        }
      }
      b.n = (("" + b.n) + sep);
      b.n = (b.n + "<cycle>");
    }
  }
  b.n = (("" + b.n) + end);
  return b;
}
/** @constructor */
function $c_sci_LazyList() {
  this.aX = null;
  this.ck = null;
}
$p = $c_sci_LazyList.prototype = new $h_sci_AbstractSeq();
$p.constructor = $c_sci_LazyList;
/** @constructor */
function $h_sci_LazyList() {
}
$h_sci_LazyList.prototype = $p;
$p.bA = (function() {
  return $f_sc_LinearSeqOps__headOption__s_Option(this);
});
$p.m = (function() {
  return $f_sc_LinearSeqOps__length__I(this);
});
$p.b2 = (function(len) {
  return $f_sc_LinearSeqOps__lengthCompare__I__I(this, len);
});
$p.j9 = (function(x) {
  return $f_sc_LinearSeqOps__isDefinedAt__I__Z(this, x);
});
$p.q = (function(n) {
  return $f_sc_LinearSeqOps__apply__I__O(this, n);
});
$p.eY = (function(that) {
  return $f_sc_LinearSeqOps__sameElements__sc_IterableOnce__Z(this, that);
});
$p.bb = (function() {
  return "LinearSeq";
});
$p.c = (function() {
  return ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F);
});
$p.u = (function() {
  return (((this.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) ? 0 : (-1));
});
$p.o = (function() {
  if (($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) {
    throw new $c_ju_NoSuchElementException("head of empty lazy list");
  } else {
    return this.aX;
  }
});
$p.aK = (function() {
  if (($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) {
    throw new $c_jl_UnsupportedOperationException("tail of empty lazy list");
  } else {
    return this.ck;
  }
});
$p.pk = (function() {
  var these = this;
  var those = this;
  if ((!($p_sci_LazyList__evaluated__sci_LazyList(these) === $m_sci_LazyList$().F))) {
    these = these.aK();
  }
  while ((those !== these)) {
    if (($p_sci_LazyList__evaluated__sci_LazyList(these) === $m_sci_LazyList$().F)) {
      return this;
    }
    these = these.aK();
    if (($p_sci_LazyList__evaluated__sci_LazyList(these) === $m_sci_LazyList$().F)) {
      return this;
    }
    these = these.aK();
    if ((these === those)) {
      return this;
    }
    those = those.aK();
  }
  return this;
});
$p.h = (function() {
  return (((this.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) ? $m_sc_Iterator$().P : new $c_sci_LazyList$LazyIterator(this));
});
$p.bz = (function(f) {
  var \u03b4this$tailLocal1 = this;
  while (true) {
    if ((!($p_sci_LazyList__evaluated__sci_LazyList(\u03b4this$tailLocal1) === $m_sci_LazyList$().F))) {
      f.b(\u03b4this$tailLocal1.o());
      \u03b4this$tailLocal1 = \u03b4this$tailLocal1.aK();
    } else {
      return (void 0);
    }
  }
});
$p.bH = (function() {
  return "LazyList";
});
$p.q9 = (function(f) {
  return (((this.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) ? $m_sci_LazyList$().F : $p_sci_LazyList__mapImpl__F1__sci_LazyList(this, f));
});
$p.pi = (function(f) {
  return (((this.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) ? $m_sci_LazyList$().F : $m_sci_LazyList$().nz(this, f));
});
$p.p8 = (function(n) {
  return ((n <= 0) ? this : (((this.aX !== $m_sci_LazyList$Uninitialized$()) && ($p_sci_LazyList__evaluated__sci_LazyList(this) === $m_sci_LazyList$().F)) ? $m_sci_LazyList$().F : $m_sci_LazyList$().qM(this, n)));
});
$p.dz = (function(sb, start, sep, end) {
  this.pk();
  $p_sci_LazyList__addStringNoForce__jl_StringBuilder__T__T__T__jl_StringBuilder(this, sb.aS, start, sep, end);
  return sb;
});
$p.p = (function() {
  return $p_sci_LazyList__addStringNoForce__jl_StringBuilder__T__T__T__jl_StringBuilder(this, $ct_jl_StringBuilder__T__(new $c_jl_StringBuilder(), "LazyList"), "(", ", ", ")").n;
});
$p.b1 = (function() {
  return $m_sci_LazyList$();
});
$p.s = (function() {
  return this.aK();
});
$p.K = (function(f) {
  return this.q9(f);
});
$p.eb = (function(asIterable) {
  return this.pi(asIterable);
});
$p.mS = (function(n) {
  return this.p8(n);
});
$p.c9 = (function(x) {
  return $f_sc_LinearSeqOps__isDefinedAt__I__Z(this, (x | 0));
});
$p.b = (function(v1) {
  return $f_sc_LinearSeqOps__apply__I__O(this, (v1 | 0));
});
function $isArrayOf_sci_LazyList(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bR)));
}
var $d_sci_LazyList = new $TypeData().i($c_sci_LazyList, "scala.collection.immutable.LazyList", ({
  bR: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  aM: 1,
  as: 1,
  aS: 1,
  aR: 1,
  a: 1
}));
function $isArrayOf_sci_WrappedString(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gU)));
}
/** @constructor */
function $c_sjsr_WrappedVarArgs(array) {
  this.gK = null;
  this.gK = array;
}
$p = $c_sjsr_WrappedVarArgs.prototype = new $h_O();
$p.constructor = $c_sjsr_WrappedVarArgs;
/** @constructor */
function $h_sjsr_WrappedVarArgs() {
}
$h_sjsr_WrappedVarArgs.prototype = $p;
$p.c7 = (function(f) {
  return $f_sci_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.eb = (function(toIterableOnce) {
  return $f_sc_StrictOptimizedIterableOps__flatten__F1__O(this, toIterableOnce);
});
$p.gV = (function(that) {
  return $f_sci_IndexedSeq__canEqual__O__Z(this, that);
});
$p.eY = (function(o) {
  return $f_sci_IndexedSeq__sameElements__sc_IterableOnce__Z(this, o);
});
$p.gT = (function() {
  return $m_sci_IndexedSeqDefaults$().lY;
});
$p.h = (function() {
  return $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(this));
});
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.l = (function(o) {
  return $f_sc_Seq__equals__O__Z(this, o);
});
$p.r = (function() {
  return $m_s_util_hashing_MurmurHash3$().nB(this);
});
$p.p = (function() {
  return $f_sc_Iterable__toString__T(this);
});
$p.c = (function() {
  return $f_sc_SeqOps__isEmpty__Z(this);
});
$p.cQ = (function(x, default$1) {
  return $f_s_PartialFunction__applyOrElse__O__F1__O(this, x, default$1);
});
$p.g6 = (function() {
  return $m_sjsr_WrappedVarArgs$().aH();
});
$p.bz = (function(f) {
  $f_sc_IterableOnceOps__foreach__F1__V(this, f);
});
$p.by = (function(dest, start, n) {
  return $f_sc_IterableOnceOps__copyToArray__O__I__I__I(this, dest, start, n);
});
$p.dz = (function(b, start, sep, end) {
  return $f_sc_IterableOnceOps__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end);
});
$p.ei = (function() {
  $m_sci_List$();
  return $m_sci_Nil$().eW(this);
});
$p.dJ = (function() {
  return $m_sjsr_WrappedVarArgs$();
});
$p.m = (function() {
  return (this.gK.length | 0);
});
$p.q = (function(idx) {
  return this.gK[idx];
});
$p.bH = (function() {
  return "WrappedVarArgs";
});
$p.g0 = (function(coll) {
  return $m_sjsr_WrappedVarArgs$().iZ(coll);
});
$p.c9 = (function(x) {
  return $f_sc_SeqOps__isDefinedAt__I__Z(this, (x | 0));
});
$p.b = (function(v1) {
  return this.q((v1 | 0));
});
$p.b1 = (function() {
  return $m_sjsr_WrappedVarArgs$();
});
function $isArrayOf_sjsr_WrappedVarArgs(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.cg)));
}
var $d_sjsr_WrappedVarArgs = new $TypeData().i($c_sjsr_WrappedVarArgs, "scala.scalajs.runtime.WrappedVarArgs", ({
  cg: 1,
  A: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  s: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  B: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_sci_HashMap(rootNode) {
  this.bh = null;
  this.bh = rootNode;
}
$p = $c_sci_HashMap.prototype = new $h_sci_AbstractMap();
$p.constructor = $c_sci_HashMap;
/** @constructor */
function $h_sci_HashMap() {
}
$h_sci_HashMap.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.nh = (function() {
  return $m_sci_HashMap$();
});
$p.u = (function() {
  return this.bh.aL;
});
$p.aJ = (function() {
  return this.bh.aL;
});
$p.c = (function() {
  return (this.bh.aL === 0);
});
$p.h = (function() {
  return (this.c() ? $m_sc_Iterator$().P : new $c_sci_MapKeyValueTupleIterator(this.bh));
});
$p.be = (function(key) {
  var keyUnimprovedHash = $m_sr_Statics$().H(key);
  var keyHash = $m_sc_Hashing$().c8(keyUnimprovedHash);
  return this.bh.iL(key, keyUnimprovedHash, keyHash, 0);
});
$p.b = (function(key) {
  var keyUnimprovedHash = $m_sr_Statics$().H(key);
  var keyHash = $m_sc_Hashing$().c8(keyUnimprovedHash);
  return this.bh.iD(key, keyUnimprovedHash, keyHash, 0);
});
$p.cT = (function(key, default$1) {
  var keyUnimprovedHash = $m_sr_Statics$().H(key);
  var keyHash = $m_sc_Hashing$().c8(keyUnimprovedHash);
  return this.bh.j1(key, keyUnimprovedHash, keyHash, 0, default$1);
});
$p.f2 = (function(key, value) {
  var keyUnimprovedHash = $m_sr_Statics$().H(key);
  var newRootNode = this.bh.nJ(key, value, keyUnimprovedHash, $m_sc_Hashing$().c8(keyUnimprovedHash), 0, true);
  return ((newRootNode === this.bh) ? this : new $c_sci_HashMap(newRootNode));
});
$p.ec = (function(f) {
  this.bh.ec(f);
});
$p.l = (function(that) {
  if ((that instanceof $c_sci_HashMap)) {
    if ((this === that)) {
      return true;
    } else {
      var x = this.bh;
      var x$2 = that.bh;
      return ((x === null) ? (x$2 === null) : x.l(x$2));
    }
  } else {
    return $f_sc_Map__equals__O__Z(this, that);
  }
});
$p.r = (function() {
  if (this.c()) {
    return $m_s_util_hashing_MurmurHash3$().iy;
  } else {
    var hashIterator = new $c_sci_MapKeyValueTupleHashIterator(this.bh);
    return $m_s_util_hashing_MurmurHash3$().ju(hashIterator, $m_s_util_hashing_MurmurHash3$().dy);
  }
});
$p.bH = (function() {
  return "HashMap";
});
$p.dM = (function(key, value) {
  return this.f2(key, value);
});
function $isArrayOf_sci_HashMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bQ)));
}
var $d_sci_HashMap = new $TypeData().i($c_sci_HashMap, "scala.collection.immutable.HashMap", ({
  bQ: 1,
  am: 1,
  ah: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  aj: 1,
  ai: 1,
  d: 1,
  a8: 1,
  s: 1,
  an: 1,
  a9: 1,
  l: 1,
  fY: 1,
  gH: 1,
  a: 1,
  V: 1
}));
function $isArrayOf_sci_TreeSeqMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gI)));
}
function $isArrayOf_sci_VectorMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gS)));
}
/** @constructor */
function $c_scm_AbstractBuffer() {
}
$p = $c_scm_AbstractBuffer.prototype = new $h_scm_AbstractSeq();
$p.constructor = $c_scm_AbstractBuffer;
/** @constructor */
function $h_scm_AbstractBuffer() {
}
$h_scm_AbstractBuffer.prototype = $p;
$p.aT = (function(elems) {
  return $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, elems);
});
function $ct_scm_HashSet__I__D__($thiz, initialCapacity, loadFactor) {
  $thiz.iu = loadFactor;
  $thiz.aQ = new ($d_scm_HashSet$Node.r().C)($p_scm_HashSet__tableSizeFor__I__I($thiz, initialCapacity));
  $thiz.iv = $p_scm_HashSet__newThreshold__I__I($thiz, $thiz.aQ.a.length);
  $thiz.dt = 0;
  return $thiz;
}
function $ct_scm_HashSet__($thiz) {
  $ct_scm_HashSet__I__D__($thiz, 16, 0.75);
  return $thiz;
}
function $p_scm_HashSet__improveHash__I__I($thiz, originalHash) {
  return (originalHash ^ ((originalHash >>> 16) | 0));
}
function $p_scm_HashSet__addElem__O__I__Z($thiz, elem, hash) {
  var idx = (hash & (($thiz.aQ.a.length - 1) | 0));
  matchResult4: {
    var x10 = $thiz.aQ.a[idx];
    if ((x10 === null)) {
      $thiz.aQ.a[idx] = new $c_scm_HashSet$Node(elem, hash, null);
      break matchResult4;
    }
    var prev = null;
    var n = x10;
    while (((n !== null) && (n.cM <= hash))) {
      if (((n.cM === hash) && $m_sr_BoxesRunTime$().k(elem, n.eL))) {
        return false;
      }
      prev = n;
      n = n.aR;
    }
    if ((prev === null)) {
      $thiz.aQ.a[idx] = new $c_scm_HashSet$Node(elem, hash, x10);
    } else {
      var this$3 = prev;
      var n$1 = new $c_scm_HashSet$Node(elem, hash, prev.aR);
      this$3.aR = n$1;
    }
  }
  $thiz.dt = ((1 + $thiz.dt) | 0);
  return true;
}
function $p_scm_HashSet__growTable__I__V($thiz, newlen) {
  var oldlen = $thiz.aQ.a.length;
  $thiz.iv = $p_scm_HashSet__newThreshold__I__I($thiz, newlen);
  if (($thiz.dt === 0)) {
    $thiz.aQ = new ($d_scm_HashSet$Node.r().C)(newlen);
  } else {
    $thiz.aQ = $m_ju_Arrays$().O($thiz.aQ, newlen);
    var preLow = new $c_scm_HashSet$Node(null, 0, null);
    var preHigh = new $c_scm_HashSet$Node(null, 0, null);
    while ((oldlen < newlen)) {
      var i = 0;
      while ((i < oldlen)) {
        var old = $thiz.aQ.a[i];
        if ((old !== null)) {
          preLow.aR = null;
          preHigh.aR = null;
          var lastLow = preLow;
          var lastHigh = preHigh;
          var n = old;
          while ((n !== null)) {
            var next = n.aR;
            if (((n.cM & oldlen) === 0)) {
              var this$2 = lastLow;
              var n$1 = n;
              this$2.aR = n$1;
              lastLow = n;
            } else {
              var this$3 = lastHigh;
              var n$2 = n;
              this$3.aR = n$2;
              lastHigh = n;
            }
            n = next;
          }
          var this$4 = lastLow;
          this$4.aR = null;
          if ((old !== preLow.aR)) {
            $thiz.aQ.a[i] = preLow.aR;
          }
          if ((preHigh.aR !== null)) {
            $thiz.aQ.a[((i + oldlen) | 0)] = preHigh.aR;
            var this$5 = lastHigh;
            this$5.aR = null;
          }
        }
        i = ((1 + i) | 0);
      }
      oldlen = (oldlen << 1);
    }
  }
}
function $p_scm_HashSet__tableSizeFor__I__I($thiz, capacity) {
  var x = ((capacity - 1) | 0);
  var i = ((x > 4) ? x : 4);
  var x$1 = ((((-2147483648) >> Math.clz32(i)) & i) << 1);
  return ((x$1 < 1073741824) ? x$1 : 1073741824);
}
function $p_scm_HashSet__newThreshold__I__I($thiz, size) {
  return $doubleToInt((size * $thiz.iu));
}
/** @constructor */
function $c_scm_HashSet() {
  this.iu = 0.0;
  this.aQ = null;
  this.iv = 0;
  this.dt = 0;
}
$p = $c_scm_HashSet.prototype = new $h_scm_AbstractSet();
$p.constructor = $c_scm_HashSet;
/** @constructor */
function $h_scm_HashSet() {
}
$h_scm_HashSet.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.aJ = (function() {
  return this.dt;
});
$p.be = (function(elem) {
  var hash = $p_scm_HashSet__improveHash__I__I(this, $m_sr_Statics$().H(elem));
  matchResult1: {
    var $x_1;
    var x1 = this.aQ.a[(hash & ((this.aQ.a.length - 1) | 0))];
    if ((x1 === null)) {
      var $x_1 = null;
      break matchResult1;
    }
    var $x_1 = x1.ph(elem, hash);
  }
  return ($x_1 !== null);
});
$p.b6 = (function(size) {
  var target = $p_scm_HashSet__tableSizeFor__I__I(this, $doubleToInt((((1 + size) | 0) / this.iu)));
  if ((target > this.aQ.a.length)) {
    $p_scm_HashSet__growTable__I__V(this, target);
  }
});
$p.gQ = (function(elem) {
  if ((((1 + this.dt) | 0) >= this.iv)) {
    $p_scm_HashSet__growTable__I__V(this, (this.aQ.a.length << 1));
  }
  return $p_scm_HashSet__addElem__O__I__Z(this, elem, $p_scm_HashSet__improveHash__I__I(this, $m_sr_Statics$().H(elem)));
});
$p.mw = (function(xs) {
  $f_scm_Builder__sizeHint__sc_IterableOnce__I__V(this, xs, 0);
  if (false) {
    var f = new $c_sr_AbstractFunction2_$$Lambda$b4228bd32034ae3b2f0c5fc896319aa4b79b55f8(((v1$2, v2$2) => {
      $p_scm_HashSet__addElem__O__I__Z(this, v1$2, $p_scm_HashSet__improveHash__I__I(this, (v2$2 | 0)));
    }));
    xs.rh.rm(f);
    return this;
  } else if ((xs instanceof $c_scm_HashSet)) {
    var iter = new $c_scm_HashSet$$anon$2(xs);
    while (iter.j()) {
      var next = iter.i();
      $p_scm_HashSet__addElem__O__I__Z(this, next.eL, next.cM);
    }
    return this;
  } else if (false) {
    var iter$2 = xs.pb();
    while (iter$2.j()) {
      var next$2 = iter$2.i();
      $p_scm_HashSet__addElem__O__I__Z(this, next$2.ng(), next$2.nb());
    }
    return this;
  } else {
    return $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, xs);
  }
});
$p.h = (function() {
  return new $c_scm_HashSet$$anon$1(this);
});
$p.b1 = (function() {
  return $m_scm_HashSet$();
});
$p.u = (function() {
  return this.dt;
});
$p.c = (function() {
  return (this.dt === 0);
});
$p.bH = (function() {
  return "HashSet";
});
$p.r = (function() {
  var setIterator = new $c_scm_HashSet$$anon$1(this);
  var hashIterator = ((!setIterator.j()) ? setIterator : new $c_scm_HashSet$$anon$3(this));
  return $m_s_util_hashing_MurmurHash3$().ju(hashIterator, $m_s_util_hashing_MurmurHash3$().mp);
});
$p.aT = (function(elems) {
  return this.mw(elems);
});
$p.aU = (function(elem) {
  this.gQ(elem);
  return this;
});
function $isArrayOf_scm_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c8)));
}
var $d_scm_HashSet = new $TypeData().i($c_scm_HashSet, "scala.collection.mutable.HashSet", ({
  c8: 1,
  gV: 1,
  fE: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  fW: 1,
  d: 1,
  aQ: 1,
  K: 1,
  C: 1,
  I: 1,
  H: 1,
  J: 1,
  M: 1,
  aA: 1,
  hn: 1,
  hm: 1,
  l: 1,
  a: 1
}));
function $isArrayOf_sci_ListMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.gn)));
}
function $isArrayOf_scm_LinkedHashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.hi)));
}
/** @constructor */
function $c_sci_ArraySeq() {
}
$p = $c_sci_ArraySeq.prototype = new $h_sci_AbstractSeq();
$p.constructor = $c_sci_ArraySeq;
/** @constructor */
function $h_sci_ArraySeq() {
}
$h_sci_ArraySeq.prototype = $p;
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.bb = (function() {
  return "IndexedSeq";
});
$p.gV = (function(that) {
  return $f_sci_IndexedSeq__canEqual__O__Z(this, that);
});
$p.eY = (function(o) {
  return $f_sci_IndexedSeq__sameElements__sc_IterableOnce__Z(this, o);
});
$p.eb = (function(toIterableOnce) {
  return $f_sc_StrictOptimizedIterableOps__flatten__F1__O(this, toIterableOnce);
});
$p.c7 = (function(f) {
  return $f_sci_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.g1 = (function(coll) {
  return $m_sci_ArraySeq$().iV(coll, this.a9());
});
$p.g6 = (function() {
  return $m_sci_ArraySeq$().h6(this.a9());
});
$p.dJ = (function() {
  return $m_sci_ArraySeq$().ie;
});
$p.q8 = (function(f) {
  var a = new $ac_O(this.m());
  var i = 0;
  while ((i < a.a.length)) {
    a.a[i] = f.b(this.q(i));
    i = ((1 + i) | 0);
  }
  return $m_sci_ArraySeq$().hd(a);
});
$p.bH = (function() {
  return "ArraySeq";
});
$p.by = (function(xs, start, len) {
  var srcLen = this.m();
  var destLen = $m_jl_reflect_Array$().bI(xs);
  var limit = ((len < srcLen) ? len : srcLen);
  var capacity = ((start < 0) ? destLen : ((destLen - start) | 0));
  var total = ((capacity < limit) ? capacity : limit);
  var copied = ((total < 0) ? 0 : total);
  if ((copied > 0)) {
    $m_s_Array$().fW(this.cs(), 0, xs, start, copied);
  }
  return copied;
});
$p.gT = (function() {
  return 2147483647;
});
$p.b1 = (function() {
  return $m_sci_ArraySeq$().ie;
});
$p.K = (function(f) {
  return this.q8(f);
});
$p.g0 = (function(coll) {
  return $m_sci_ArraySeq$().iV(coll, this.a9());
});
function $isArrayOf_sci_ArraySeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.a0)));
}
function $ct_sci_Vector__AO__($thiz, prefix1) {
  $thiz.d = prefix1;
  return $thiz;
}
/** @constructor */
function $c_sci_Vector() {
  this.d = null;
}
$p = $c_sci_Vector.prototype = new $h_sci_AbstractSeq();
$p.constructor = $c_sci_Vector;
/** @constructor */
function $h_sci_Vector() {
}
$h_sci_Vector.prototype = $p;
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.bb = (function() {
  return "IndexedSeq";
});
$p.gV = (function(that) {
  return $f_sci_IndexedSeq__canEqual__O__Z(this, that);
});
$p.eY = (function(o) {
  return $f_sci_IndexedSeq__sameElements__sc_IterableOnce__Z(this, o);
});
$p.eb = (function(toIterableOnce) {
  return $f_sc_StrictOptimizedIterableOps__flatten__F1__O(this, toIterableOnce);
});
$p.c7 = (function(f) {
  return $f_sci_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.dJ = (function() {
  return $m_sci_Vector$();
});
$p.m = (function() {
  return ((this instanceof $c_sci_BigVector) ? this.g : this.d.a.length);
});
$p.h = (function() {
  return ((this === $m_sci_Vector0$()) ? $m_sci_Vector$().m4 : new $c_sci_NewVectorIterator(this, this.m(), this.cu()));
});
$p.bH = (function() {
  return "Vector";
});
$p.by = (function(xs, start, len) {
  return this.h().by(xs, start, len);
});
$p.gT = (function() {
  return $m_sci_Vector$().m3;
});
$p.az = (function(index) {
  return $m_scg_CommonErrors$().j7(index, ((this.m() - 1) | 0));
});
$p.o = (function() {
  if ((this.d.a.length === 0)) {
    throw new $c_ju_NoSuchElementException("empty.head");
  } else {
    return this.d.a[0];
  }
});
$p.bz = (function(f) {
  var c = this.cu();
  var i = 0;
  while ((i < c)) {
    var $x_1 = $m_sci_VectorStatics$();
    var idx = i;
    var c$1 = (((c + ((c >>> 31) | 0)) | 0) >> 1);
    var a = ((idx - c$1) | 0);
    var sign = (a >> 31);
    $x_1.iT(((((((1 + c$1) | 0) - (((a ^ sign) - sign) | 0)) | 0) - 1) | 0), this.ct(i), f);
    i = ((1 + i) | 0);
  }
});
$p.b1 = (function() {
  return $m_sci_Vector$();
});
function $isArrayOf_sci_Vector(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.aa)));
}
/** @constructor */
function $c_scm_ArraySeq() {
}
$p = $c_scm_ArraySeq.prototype = new $h_scm_AbstractSeq();
$p.constructor = $c_scm_ArraySeq;
/** @constructor */
function $h_scm_ArraySeq() {
}
$h_scm_ArraySeq.prototype = $p;
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.u = (function() {
  return this.m();
});
$p.bb = (function() {
  return "IndexedSeq";
});
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.c7 = (function(f) {
  return $f_sc_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.dJ = (function() {
  return $m_scm_ArraySeq$().it;
});
$p.n7 = (function(coll) {
  var evidence$1 = this.a9();
  var capacity = 0;
  var size = 0;
  var jsElems = null;
  var elementClass = evidence$1.aI();
  capacity = 0;
  size = 0;
  var isCharArrayBuilder = (elementClass === $d_C.l());
  jsElems = [];
  coll.u();
  var it = coll.h();
  while (it.j()) {
    var elem = it.i();
    var unboxedElem = (isCharArrayBuilder ? $uC(elem) : ((elem === null) ? $m_scm_ArrayBuilder$().ha(elementClass) : elem));
    jsElems.push(unboxedElem);
  }
  return $m_scm_ArraySeq$().jd($m_scm_ArrayBuilder$().h9(((elementClass === $d_V.l()) ? $d_jl_Void.l() : (((elementClass === $d_sr_Null$.l()) || (elementClass === $d_sr_Nothing$.l())) ? $d_O.l() : elementClass)), jsElems));
});
$p.g6 = (function() {
  return $m_scm_ArraySeq$().h6(this.a9());
});
$p.bH = (function() {
  return "ArraySeq";
});
$p.by = (function(xs, start, len) {
  var srcLen = this.m();
  var destLen = $m_jl_reflect_Array$().bI(xs);
  var limit = ((len < srcLen) ? len : srcLen);
  var capacity = ((start < 0) ? destLen : ((destLen - start) | 0));
  var total = ((capacity < limit) ? capacity : limit);
  var copied = ((total < 0) ? 0 : total);
  if ((copied > 0)) {
    $m_s_Array$().fW(this.bW(), 0, xs, start, copied);
  }
  return copied;
});
$p.l = (function(other) {
  if ((other instanceof $c_scm_ArraySeq)) {
    if (($m_jl_reflect_Array$().bI(this.bW()) !== $m_jl_reflect_Array$().bI(other.bW()))) {
      return false;
    }
  }
  return $f_sc_Seq__equals__O__Z(this, other);
});
$p.b1 = (function() {
  return $m_scm_ArraySeq$().it;
});
$p.g1 = (function(coll) {
  return this.n7(coll);
});
$p.g0 = (function(coll) {
  return this.n7(coll);
});
function $isArrayOf_scm_ArraySeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.a1)));
}
/** @constructor */
function $c_sci_ArraySeq$ofBoolean(unsafeArray) {
  this.d5 = null;
  this.d5 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofBoolean.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofBoolean;
/** @constructor */
function $h_sci_ArraySeq$ofBoolean() {
}
$h_sci_ArraySeq$ofBoolean.prototype = $p;
$p.m = (function() {
  return this.d5.a.length;
});
$p.fT = (function(i) {
  return this.d5.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.d5, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofBoolean) ? $m_ju_Arrays$().mZ(this.d5, that.d5) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.d5);
});
$p.cs = (function() {
  return this.d5;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$BooleanManifest$();
});
$p.q = (function(i) {
  return this.fT(i);
});
$p.b = (function(v1) {
  return this.fT((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofBoolean(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bD)));
}
var $d_sci_ArraySeq$ofBoolean = new $TypeData().i($c_sci_ArraySeq$ofBoolean, "scala.collection.immutable.ArraySeq$ofBoolean", ({
  bD: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofByte(unsafeArray) {
  this.d6 = null;
  this.d6 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofByte.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofByte;
/** @constructor */
function $h_sci_ArraySeq$ofByte() {
}
$h_sci_ArraySeq$ofByte.prototype = $p;
$p.m = (function() {
  return this.d6.a.length;
});
$p.fL = (function(i) {
  return this.d6.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.d6, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofByte) ? $m_ju_Arrays$().mV(this.d6, that.d6) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.d6);
});
$p.cs = (function() {
  return this.d6;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$ByteManifest$();
});
$p.q = (function(i) {
  return this.fL(i);
});
$p.b = (function(v1) {
  return this.fL((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofByte(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bE)));
}
var $d_sci_ArraySeq$ofByte = new $TypeData().i($c_sci_ArraySeq$ofByte, "scala.collection.immutable.ArraySeq$ofByte", ({
  bE: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofChar(unsafeArray) {
  this.cB = null;
  this.cB = unsafeArray;
}
$p = $c_sci_ArraySeq$ofChar.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofChar;
/** @constructor */
function $h_sci_ArraySeq$ofChar() {
}
$h_sci_ArraySeq$ofChar.prototype = $p;
$p.m = (function() {
  return this.cB.a.length;
});
$p.fM = (function(i) {
  return this.cB.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.cB, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofChar) ? $m_ju_Arrays$().mW(this.cB, that.cB) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.cB);
});
$p.dz = (function(sb, start, sep, end) {
  return new $c_scm_ArraySeq$ofChar(this.cB).dz(sb, start, sep, end);
});
$p.cs = (function() {
  return this.cB;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$CharManifest$();
});
$p.q = (function(i) {
  return $bC(this.fM(i));
});
$p.b = (function(v1) {
  return $bC(this.fM((v1 | 0)));
});
function $isArrayOf_sci_ArraySeq$ofChar(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bF)));
}
var $d_sci_ArraySeq$ofChar = new $TypeData().i($c_sci_ArraySeq$ofChar, "scala.collection.immutable.ArraySeq$ofChar", ({
  bF: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofDouble(unsafeArray) {
  this.d7 = null;
  this.d7 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofDouble.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofDouble;
/** @constructor */
function $h_sci_ArraySeq$ofDouble() {
}
$h_sci_ArraySeq$ofDouble.prototype = $p;
$p.m = (function() {
  return this.d7.a.length;
});
$p.fN = (function(i) {
  return this.d7.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.d7, this$1.ae);
});
$p.l = (function(that) {
  if ((that instanceof $c_sci_ArraySeq$ofDouble)) {
    var array = this.d7;
    var thatArray = that.d7;
    if ((array === thatArray)) {
      return true;
    } else if ((array.a.length === thatArray.a.length)) {
      var i = 0;
      while (((i < array.a.length) && (array.a[i] === thatArray.a[i]))) {
        i = ((1 + i) | 0);
      }
      return (i >= array.a.length);
    } else {
      return false;
    }
  } else {
    return $f_sc_Seq__equals__O__Z(this, that);
  }
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.d7);
});
$p.cs = (function() {
  return this.d7;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$DoubleManifest$();
});
$p.q = (function(i) {
  return this.fN(i);
});
$p.b = (function(v1) {
  return this.fN((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofDouble(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bG)));
}
var $d_sci_ArraySeq$ofDouble = new $TypeData().i($c_sci_ArraySeq$ofDouble, "scala.collection.immutable.ArraySeq$ofDouble", ({
  bG: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofFloat(unsafeArray) {
  this.d8 = null;
  this.d8 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofFloat.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofFloat;
/** @constructor */
function $h_sci_ArraySeq$ofFloat() {
}
$h_sci_ArraySeq$ofFloat.prototype = $p;
$p.m = (function() {
  return this.d8.a.length;
});
$p.fO = (function(i) {
  return this.d8.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.d8, this$1.ae);
});
$p.l = (function(that) {
  if ((that instanceof $c_sci_ArraySeq$ofFloat)) {
    var array = this.d8;
    var thatArray = that.d8;
    if ((array === thatArray)) {
      return true;
    } else if ((array.a.length === thatArray.a.length)) {
      var i = 0;
      while (((i < array.a.length) && (array.a[i] === thatArray.a[i]))) {
        i = ((1 + i) | 0);
      }
      return (i >= array.a.length);
    } else {
      return false;
    }
  } else {
    return $f_sc_Seq__equals__O__Z(this, that);
  }
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.d8);
});
$p.cs = (function() {
  return this.d8;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$FloatManifest$();
});
$p.q = (function(i) {
  return this.fO(i);
});
$p.b = (function(v1) {
  return this.fO((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofFloat(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bH)));
}
var $d_sci_ArraySeq$ofFloat = new $TypeData().i($c_sci_ArraySeq$ofFloat, "scala.collection.immutable.ArraySeq$ofFloat", ({
  bH: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofInt(unsafeArray) {
  this.d9 = null;
  this.d9 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofInt.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofInt;
/** @constructor */
function $h_sci_ArraySeq$ofInt() {
}
$h_sci_ArraySeq$ofInt.prototype = $p;
$p.m = (function() {
  return this.d9.a.length;
});
$p.fP = (function(i) {
  return this.d9.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.d9, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofInt) ? $m_ju_Arrays$().iQ(this.d9, that.d9) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.d9);
});
$p.cs = (function() {
  return this.d9;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$IntManifest$();
});
$p.q = (function(i) {
  return this.fP(i);
});
$p.b = (function(v1) {
  return this.fP((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofInt(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bI)));
}
var $d_sci_ArraySeq$ofInt = new $TypeData().i($c_sci_ArraySeq$ofInt, "scala.collection.immutable.ArraySeq$ofInt", ({
  bI: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofLong(unsafeArray) {
  this.da = null;
  this.da = unsafeArray;
}
$p = $c_sci_ArraySeq$ofLong.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofLong;
/** @constructor */
function $h_sci_ArraySeq$ofLong() {
}
$h_sci_ArraySeq$ofLong.prototype = $p;
$p.m = (function() {
  return ((this.da.a.length >>> 1) | 0);
});
$p.fQ = (function(i) {
  var $x_1 = this.da.a;
  var $x_2 = (i << 1);
  return $bL($x_1[$x_2], $x_1[(($x_2 + 1) | 0)]);
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.da, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofLong) ? $m_ju_Arrays$().mX(this.da, that.da) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.da);
});
$p.cs = (function() {
  return this.da;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$LongManifest$();
});
$p.q = (function(i) {
  return this.fQ(i);
});
$p.b = (function(v1) {
  return this.fQ((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bJ)));
}
var $d_sci_ArraySeq$ofLong = new $TypeData().i($c_sci_ArraySeq$ofLong, "scala.collection.immutable.ArraySeq$ofLong", ({
  bJ: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofRef(unsafeArray) {
  this.ci = null;
  this.ci = unsafeArray;
}
$p = $c_sci_ArraySeq$ofRef.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofRef;
/** @constructor */
function $h_sci_ArraySeq$ofRef() {
}
$h_sci_ArraySeq$ofRef.prototype = $p;
$p.a9 = (function() {
  return $m_s_reflect_ClassTag$().mF($objectGetClass(this.ci).X.Q());
});
$p.m = (function() {
  return this.ci.a.length;
});
$p.q = (function(i) {
  return this.ci.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.ci, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofRef) ? $m_s_Array$().n0(this.ci, that.ci) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.ci);
});
$p.cs = (function() {
  return this.ci;
});
$p.b = (function(v1) {
  return this.q((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofRef(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bK)));
}
var $d_sci_ArraySeq$ofRef = new $TypeData().i($c_sci_ArraySeq$ofRef, "scala.collection.immutable.ArraySeq$ofRef", ({
  bK: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofShort(unsafeArray) {
  this.db = null;
  this.db = unsafeArray;
}
$p = $c_sci_ArraySeq$ofShort.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofShort;
/** @constructor */
function $h_sci_ArraySeq$ofShort() {
}
$h_sci_ArraySeq$ofShort.prototype = $p;
$p.m = (function() {
  return this.db.a.length;
});
$p.fR = (function(i) {
  return this.db.a[i];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.db, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofShort) ? $m_ju_Arrays$().mY(this.db, that.db) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.db);
});
$p.cs = (function() {
  return this.db;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$ShortManifest$();
});
$p.q = (function(i) {
  return this.fR(i);
});
$p.b = (function(v1) {
  return this.fR((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofShort(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bL)));
}
var $d_sci_ArraySeq$ofShort = new $TypeData().i($c_sci_ArraySeq$ofShort, "scala.collection.immutable.ArraySeq$ofShort", ({
  bL: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
/** @constructor */
function $c_sci_ArraySeq$ofUnit(unsafeArray) {
  this.e0 = null;
  this.e0 = unsafeArray;
}
$p = $c_sci_ArraySeq$ofUnit.prototype = new $h_sci_ArraySeq();
$p.constructor = $c_sci_ArraySeq$ofUnit;
/** @constructor */
function $h_sci_ArraySeq$ofUnit() {
}
$h_sci_ArraySeq$ofUnit.prototype = $p;
$p.m = (function() {
  return this.e0.a.length;
});
$p.fS = (function(i) {
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.e0, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_sci_ArraySeq$ofUnit) ? (this.e0.a.length === that.e0.a.length) : $f_sc_Seq__equals__O__Z(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.e0);
});
$p.cs = (function() {
  return this.e0;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$UnitManifest$();
});
$p.q = (function(i) {
  this.fS(i);
});
$p.b = (function(v1) {
  this.fS((v1 | 0));
});
function $isArrayOf_sci_ArraySeq$ofUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bM)));
}
var $d_sci_ArraySeq$ofUnit = new $TypeData().i($c_sci_ArraySeq$ofUnit, "scala.collection.immutable.ArraySeq$ofUnit", ({
  bM: 1,
  a0: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a3: 1,
  a: 1
}));
function $p_sci_List__loop$2__I__I__sci_List__I($thiz, len$1, i, xs) {
  var xs$tailLocal1 = xs;
  var i$tailLocal1 = i;
  while (true) {
    if ((i$tailLocal1 === len$1)) {
      return ((!xs$tailLocal1.c()) | 0);
    } else {
      if ((!xs$tailLocal1.c())) {
        var i$tailLocal1$tmp1 = ((1 + i$tailLocal1) | 0);
        var xs$tailLocal1$tmp1 = xs$tailLocal1.s();
        i$tailLocal1 = i$tailLocal1$tmp1;
        xs$tailLocal1 = xs$tailLocal1$tmp1;
        continue;
      }
      return (-1);
    }
  }
}
function $p_sci_List__listEq$1__sci_List__sci_List__Z($thiz, a, b) {
  var b$tailLocal1 = b;
  var a$tailLocal1 = a;
  while (true) {
    if ((a$tailLocal1 === b$tailLocal1)) {
      return true;
    } else {
      var aEmpty = a$tailLocal1.c();
      var bEmpty = b$tailLocal1.c();
      if (((!(aEmpty || bEmpty)) && $m_sr_BoxesRunTime$().k(a$tailLocal1.o(), b$tailLocal1.o()))) {
        var a$tailLocal1$tmp1 = a$tailLocal1.s();
        var b$tailLocal1$tmp1 = b$tailLocal1.s();
        a$tailLocal1 = a$tailLocal1$tmp1;
        b$tailLocal1 = b$tailLocal1$tmp1;
        continue;
      }
      return (aEmpty && bEmpty);
    }
  }
}
/** @constructor */
function $c_sci_List() {
}
$p = $c_sci_List.prototype = new $h_sci_AbstractSeq();
$p.constructor = $c_sci_List;
/** @constructor */
function $h_sci_List() {
}
$h_sci_List.prototype = $p;
$p.j9 = (function(x) {
  return $f_sc_LinearSeqOps__isDefinedAt__I__Z(this, x);
});
$p.q = (function(n) {
  return $f_sc_LinearSeqOps__apply__I__O(this, n);
});
$p.eY = (function(that) {
  return $f_sc_LinearSeqOps__sameElements__sc_IterableOnce__Z(this, that);
});
$p.bb = (function() {
  return "LinearSeq";
});
$p.eb = (function(toIterableOnce) {
  return $f_sc_StrictOptimizedIterableOps__flatten__F1__O(this, toIterableOnce);
});
$p.h = (function() {
  return new $c_sc_StrictOptimizedLinearSeqOps$$anon$1(this);
});
$p.c7 = (function(f) {
  return $f_sci_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.dJ = (function() {
  return $m_sci_List$();
});
$p.mq = (function(prefix) {
  if (this.c()) {
    return prefix;
  } else if (prefix.c()) {
    return this;
  } else {
    var result = new $c_sci_$colon$colon(prefix.o(), this);
    var curr = result;
    var that = prefix.s();
    while ((!that.c())) {
      var temp = new $c_sci_$colon$colon(that.o(), this);
      curr.ap = temp;
      curr = temp;
      that = that.s();
    }
    return result;
  }
});
$p.c = (function() {
  return (this === $m_sci_Nil$());
});
$p.eW = (function(prefix) {
  if ((prefix instanceof $c_sci_List)) {
    return this.mq(prefix);
  }
  if ((prefix.u() === 0)) {
    return this;
  }
  if ((prefix instanceof $c_scm_ListBuffer)) {
    if (this.c()) {
      return prefix.ei();
    }
  }
  var iter = prefix.h();
  if (iter.j()) {
    var result = new $c_sci_$colon$colon(iter.i(), this);
    var curr = result;
    while (iter.j()) {
      var temp = new $c_sci_$colon$colon(iter.i(), this);
      curr.ap = temp;
      curr = temp;
    }
    return result;
  } else {
    return this;
  }
});
$p.mC = (function(suffix) {
  return ((suffix instanceof $c_sci_List) ? suffix.mq(this) : $f_sc_StrictOptimizedSeqOps__appendedAll__sc_IterableOnce__O(this, suffix));
});
$p.qa = (function(f) {
  if ((this === $m_sci_Nil$())) {
    var $x_1 = $m_sci_Nil$();
  } else {
    var h = new $c_sci_$colon$colon(f.b(this.o()), $m_sci_Nil$());
    var t = h;
    var rest = this.s();
    while ((rest !== $m_sci_Nil$())) {
      var nx = new $c_sci_$colon$colon(f.b(rest.o()), $m_sci_Nil$());
      t.ap = nx;
      t = nx;
      rest = rest.s();
    }
    var $x_1 = h;
  }
  return $x_1;
});
$p.bz = (function(f) {
  var these = this;
  while ((!these.c())) {
    f.b(these.o());
    these = these.s();
  }
});
$p.m = (function() {
  var these = this;
  var len = 0;
  while ((!these.c())) {
    len = ((1 + len) | 0);
    these = these.s();
  }
  return len;
});
$p.b2 = (function(len) {
  return ((len < 0) ? 1 : $p_sci_List__loop$2__I__I__sci_List__I(this, len, 0, this));
});
$p.be = (function(elem) {
  var these = this;
  while ((!these.c())) {
    if ($m_sr_BoxesRunTime$().k(these.o(), elem)) {
      return true;
    }
    these = these.s();
  }
  return false;
});
$p.bH = (function() {
  return "List";
});
$p.ei = (function() {
  return this;
});
$p.l = (function(o) {
  return ((o instanceof $c_sci_List) ? $p_sci_List__listEq$1__sci_List__sci_List__Z(this, this, o) : $f_sc_Seq__equals__O__Z(this, o));
});
$p.b1 = (function() {
  return $m_sci_List$();
});
$p.K = (function(f) {
  return this.qa(f);
});
$p.mS = (function(n) {
  return $p_sc_StrictOptimizedLinearSeqOps__loop$2__I__sc_LinearSeq__sc_LinearSeq(this, n, this);
});
$p.c9 = (function(x) {
  return $f_sc_LinearSeqOps__isDefinedAt__I__Z(this, (x | 0));
});
$p.b = (function(v1) {
  return $f_sc_LinearSeqOps__apply__I__O(this, (v1 | 0));
});
function $isArrayOf_sci_List(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.aT)));
}
/** @constructor */
function $c_sci_VectorImpl() {
  this.d = null;
}
$p = $c_sci_VectorImpl.prototype = new $h_sci_Vector();
$p.constructor = $c_sci_VectorImpl;
/** @constructor */
function $h_sci_VectorImpl() {
}
$h_sci_VectorImpl.prototype = $p;
/** @constructor */
function $c_scm_ArraySeq$ofBoolean(array) {
  this.dm = null;
  this.dm = array;
}
$p = $c_scm_ArraySeq$ofBoolean.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofBoolean;
/** @constructor */
function $h_scm_ArraySeq$ofBoolean() {
}
$h_scm_ArraySeq$ofBoolean.prototype = $p;
$p.m = (function() {
  return this.dm.a.length;
});
$p.fT = (function(index) {
  return this.dm.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.dm, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofBoolean) ? $m_ju_Arrays$().mZ(this.dm, that.dm) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.dm);
});
$p.bW = (function() {
  return this.dm;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$BooleanManifest$();
});
$p.q = (function(i) {
  return this.fT(i);
});
$p.b = (function(v1) {
  return this.fT((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofBoolean(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bY)));
}
var $d_scm_ArraySeq$ofBoolean = new $TypeData().i($c_scm_ArraySeq$ofBoolean, "scala.collection.mutable.ArraySeq$ofBoolean", ({
  bY: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofByte(array) {
  this.dn = null;
  this.dn = array;
}
$p = $c_scm_ArraySeq$ofByte.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofByte;
/** @constructor */
function $h_scm_ArraySeq$ofByte() {
}
$h_scm_ArraySeq$ofByte.prototype = $p;
$p.m = (function() {
  return this.dn.a.length;
});
$p.fL = (function(index) {
  return this.dn.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.dn, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofByte) ? $m_ju_Arrays$().mV(this.dn, that.dn) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.dn);
});
$p.bW = (function() {
  return this.dn;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$ByteManifest$();
});
$p.q = (function(i) {
  return this.fL(i);
});
$p.b = (function(v1) {
  return this.fL((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofByte(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bZ)));
}
var $d_scm_ArraySeq$ofByte = new $TypeData().i($c_scm_ArraySeq$ofByte, "scala.collection.mutable.ArraySeq$ofByte", ({
  bZ: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofChar(array) {
  this.bG = null;
  this.bG = array;
}
$p = $c_scm_ArraySeq$ofChar.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofChar;
/** @constructor */
function $h_scm_ArraySeq$ofChar() {
}
$h_scm_ArraySeq$ofChar.prototype = $p;
$p.m = (function() {
  return this.bG.a.length;
});
$p.fM = (function(index) {
  return this.bG.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.bG, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofChar) ? $m_ju_Arrays$().mW(this.bG, that.bG) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.bG);
});
$p.dz = (function(sb, start, sep, end) {
  var jsb = sb.aS;
  if ((start.length !== 0)) {
    jsb.n = (("" + jsb.n) + start);
  }
  var len = this.bG.a.length;
  if ((len !== 0)) {
    if ((sep === "")) {
      jsb.mA(this.bG);
    } else {
      jsb.m();
      var c = this.bG.a[0];
      var str = ("" + $cToS(c));
      jsb.n = (jsb.n + str);
      var i = 1;
      while ((i < len)) {
        jsb.n = (("" + jsb.n) + sep);
        var c$1 = this.bG.a[i];
        var str$1 = ("" + $cToS(c$1));
        jsb.n = (jsb.n + str$1);
        i = ((1 + i) | 0);
      }
    }
  }
  if ((end.length !== 0)) {
    jsb.n = (("" + jsb.n) + end);
  }
  return sb;
});
$p.bW = (function() {
  return this.bG;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$CharManifest$();
});
$p.q = (function(i) {
  return $bC(this.fM(i));
});
$p.b = (function(v1) {
  return $bC(this.fM((v1 | 0)));
});
function $isArrayOf_scm_ArraySeq$ofChar(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c0)));
}
var $d_scm_ArraySeq$ofChar = new $TypeData().i($c_scm_ArraySeq$ofChar, "scala.collection.mutable.ArraySeq$ofChar", ({
  c0: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofDouble(array) {
  this.bR = null;
  this.bR = array;
}
$p = $c_scm_ArraySeq$ofDouble.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofDouble;
/** @constructor */
function $h_scm_ArraySeq$ofDouble() {
}
$h_scm_ArraySeq$ofDouble.prototype = $p;
$p.m = (function() {
  return this.bR.a.length;
});
$p.fN = (function(index) {
  return this.bR.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.bR, this$1.ae);
});
$p.l = (function(that) {
  if ((that instanceof $c_scm_ArraySeq$ofDouble)) {
    var thatArray = that.bR;
    if ((this.bR === thatArray)) {
      return true;
    } else if ((this.bR.a.length === thatArray.a.length)) {
      var i = 0;
      while (((i < this.bR.a.length) && (this.bR.a[i] === thatArray.a[i]))) {
        i = ((1 + i) | 0);
      }
      return (i >= this.bR.a.length);
    } else {
      return false;
    }
  } else {
    return $c_scm_ArraySeq.prototype.l.call(this, that);
  }
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.bR);
});
$p.bW = (function() {
  return this.bR;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$DoubleManifest$();
});
$p.q = (function(i) {
  return this.fN(i);
});
$p.b = (function(v1) {
  return this.fN((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofDouble(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c1)));
}
var $d_scm_ArraySeq$ofDouble = new $TypeData().i($c_scm_ArraySeq$ofDouble, "scala.collection.mutable.ArraySeq$ofDouble", ({
  c1: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofFloat(array) {
  this.bS = null;
  this.bS = array;
}
$p = $c_scm_ArraySeq$ofFloat.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofFloat;
/** @constructor */
function $h_scm_ArraySeq$ofFloat() {
}
$h_scm_ArraySeq$ofFloat.prototype = $p;
$p.m = (function() {
  return this.bS.a.length;
});
$p.fO = (function(index) {
  return this.bS.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.bS, this$1.ae);
});
$p.l = (function(that) {
  if ((that instanceof $c_scm_ArraySeq$ofFloat)) {
    var thatArray = that.bS;
    if ((this.bS === thatArray)) {
      return true;
    } else if ((this.bS.a.length === thatArray.a.length)) {
      var i = 0;
      while (((i < this.bS.a.length) && (this.bS.a[i] === thatArray.a[i]))) {
        i = ((1 + i) | 0);
      }
      return (i >= this.bS.a.length);
    } else {
      return false;
    }
  } else {
    return $c_scm_ArraySeq.prototype.l.call(this, that);
  }
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.bS);
});
$p.bW = (function() {
  return this.bS;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$FloatManifest$();
});
$p.q = (function(i) {
  return this.fO(i);
});
$p.b = (function(v1) {
  return this.fO((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofFloat(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c2)));
}
var $d_scm_ArraySeq$ofFloat = new $TypeData().i($c_scm_ArraySeq$ofFloat, "scala.collection.mutable.ArraySeq$ofFloat", ({
  c2: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofInt(array) {
  this.dp = null;
  this.dp = array;
}
$p = $c_scm_ArraySeq$ofInt.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofInt;
/** @constructor */
function $h_scm_ArraySeq$ofInt() {
}
$h_scm_ArraySeq$ofInt.prototype = $p;
$p.m = (function() {
  return this.dp.a.length;
});
$p.fP = (function(index) {
  return this.dp.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.dp, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofInt) ? $m_ju_Arrays$().iQ(this.dp, that.dp) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.dp);
});
$p.bW = (function() {
  return this.dp;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$IntManifest$();
});
$p.q = (function(i) {
  return this.fP(i);
});
$p.b = (function(v1) {
  return this.fP((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofInt(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c3)));
}
var $d_scm_ArraySeq$ofInt = new $TypeData().i($c_scm_ArraySeq$ofInt, "scala.collection.mutable.ArraySeq$ofInt", ({
  c3: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofLong(array) {
  this.dq = null;
  this.dq = array;
}
$p = $c_scm_ArraySeq$ofLong.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofLong;
/** @constructor */
function $h_scm_ArraySeq$ofLong() {
}
$h_scm_ArraySeq$ofLong.prototype = $p;
$p.m = (function() {
  return ((this.dq.a.length >>> 1) | 0);
});
$p.fQ = (function(index) {
  var $x_1 = this.dq.a;
  var $x_2 = (index << 1);
  return $bL($x_1[$x_2], $x_1[(($x_2 + 1) | 0)]);
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.dq, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofLong) ? $m_ju_Arrays$().mX(this.dq, that.dq) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.dq);
});
$p.bW = (function() {
  return this.dq;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$LongManifest$();
});
$p.q = (function(i) {
  return this.fQ(i);
});
$p.b = (function(v1) {
  return this.fQ((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c4)));
}
var $d_scm_ArraySeq$ofLong = new $TypeData().i($c_scm_ArraySeq$ofLong, "scala.collection.mutable.ArraySeq$ofLong", ({
  c4: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofRef(array) {
  this.cK = null;
  this.cK = array;
}
$p = $c_scm_ArraySeq$ofRef.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofRef;
/** @constructor */
function $h_scm_ArraySeq$ofRef() {
}
$h_scm_ArraySeq$ofRef.prototype = $p;
$p.a9 = (function() {
  return $m_s_reflect_ClassTag$().mF($objectGetClass(this.cK).X.Q());
});
$p.m = (function() {
  return this.cK.a.length;
});
$p.q = (function(index) {
  return this.cK.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.cK, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofRef) ? $m_s_Array$().n0(this.cK, that.cK) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.cK);
});
$p.bW = (function() {
  return this.cK;
});
$p.b = (function(v1) {
  return this.q((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofRef(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c5)));
}
var $d_scm_ArraySeq$ofRef = new $TypeData().i($c_scm_ArraySeq$ofRef, "scala.collection.mutable.ArraySeq$ofRef", ({
  c5: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofShort(array) {
  this.dr = null;
  this.dr = array;
}
$p = $c_scm_ArraySeq$ofShort.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofShort;
/** @constructor */
function $h_scm_ArraySeq$ofShort() {
}
$h_scm_ArraySeq$ofShort.prototype = $p;
$p.m = (function() {
  return this.dr.a.length;
});
$p.fR = (function(index) {
  return this.dr.a[index];
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.dr, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofShort) ? $m_ju_Arrays$().mY(this.dr, that.dr) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.dr);
});
$p.bW = (function() {
  return this.dr;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$ShortManifest$();
});
$p.q = (function(i) {
  return this.fR(i);
});
$p.b = (function(v1) {
  return this.fR((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofShort(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c6)));
}
var $d_scm_ArraySeq$ofShort = new $TypeData().i($c_scm_ArraySeq$ofShort, "scala.collection.mutable.ArraySeq$ofShort", ({
  c6: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
/** @constructor */
function $c_scm_ArraySeq$ofUnit(array) {
  this.e6 = null;
  this.e6 = array;
}
$p = $c_scm_ArraySeq$ofUnit.prototype = new $h_scm_ArraySeq();
$p.constructor = $c_scm_ArraySeq$ofUnit;
/** @constructor */
function $h_scm_ArraySeq$ofUnit() {
}
$h_scm_ArraySeq$ofUnit.prototype = $p;
$p.m = (function() {
  return this.e6.a.length;
});
$p.fS = (function(index) {
});
$p.r = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.aG(this.e6, this$1.ae);
});
$p.l = (function(that) {
  return ((that instanceof $c_scm_ArraySeq$ofUnit) ? (this.e6.a.length === that.e6.a.length) : $c_scm_ArraySeq.prototype.l.call(this, that));
});
$p.h = (function() {
  return new $c_sc_ArrayOps$ArrayIterator(this.e6);
});
$p.bW = (function() {
  return this.e6;
});
$p.a9 = (function() {
  return $m_s_reflect_ManifestFactory$UnitManifest$();
});
$p.q = (function(i) {
  this.fS(i);
});
$p.b = (function(v1) {
  this.fS((v1 | 0));
});
function $isArrayOf_scm_ArraySeq$ofUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.c7)));
}
var $d_scm_ArraySeq$ofUnit = new $TypeData().i($c_scm_ArraySeq$ofUnit, "scala.collection.mutable.ArraySeq$ofUnit", ({
  c7: 1,
  a1: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  l: 1,
  r: 1,
  a: 1
}));
function $isArrayOf_scm_HashMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.h8)));
}
function $ct_sci_BigVector__AO__AO__I__($thiz, _prefix1, suffix1, length0) {
  $thiz.f = suffix1;
  $thiz.g = length0;
  $ct_sci_Vector__AO__($thiz, _prefix1);
  return $thiz;
}
/** @constructor */
function $c_sci_BigVector() {
  this.d = null;
  this.f = null;
  this.g = 0;
}
$p = $c_sci_BigVector.prototype = new $h_sci_VectorImpl();
$p.constructor = $c_sci_BigVector;
/** @constructor */
function $h_sci_BigVector() {
}
$h_sci_BigVector.prototype = $p;
function $isArrayOf_sci_BigVector(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ad)));
}
/** @constructor */
function $c_sci_Vector1(_data1) {
  this.d = null;
  $ct_sci_Vector__AO__(this, _data1);
}
$p = $c_sci_Vector1.prototype = new $h_sci_VectorImpl();
$p.constructor = $c_sci_Vector1;
/** @constructor */
function $h_sci_Vector1() {
}
$h_sci_Vector1.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.d.a.length))) {
    return this.d.a[index];
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.d.a.length))) {
    var a1 = this.d;
    var a1c = a1.e();
    a1c.a[index] = elem;
    return new $c_sci_Vector1(a1c);
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.d.a.length < 32)) {
    return new $c_sci_Vector1($m_sci_VectorStatics$().eP(this.d, elem));
  } else {
    var $x_2 = this.d;
    var $x_1 = $m_sci_VectorStatics$().bk;
    var a = new $ac_O(1);
    a.a[0] = elem;
    return new $c_sci_Vector2($x_2, 32, $x_1, a, 33);
  }
});
$p.ca = (function(f) {
  return new $c_sci_Vector1($m_sci_VectorStatics$().bX(this.d, f));
});
$p.cu = (function() {
  return 1;
});
$p.ct = (function(idx) {
  return this.d;
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.d.a.length))) {
    return this.d.a[index];
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector1 = new $TypeData().i($c_sci_Vector1, "scala.collection.immutable.Vector1", ({
  gL: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
/** @constructor */
function $c_sci_$colon$colon(head, next) {
  this.gC = null;
  this.ap = null;
  this.gC = head;
  this.ap = next;
}
$p = $c_sci_$colon$colon.prototype = new $h_sci_List();
$p.constructor = $c_sci_$colon$colon;
/** @constructor */
function $h_sci_$colon$colon() {
}
$h_sci_$colon$colon.prototype = $p;
$p.bJ = (function() {
  return new $c_s_Product$$anon$1(this);
});
$p.b3 = (function() {
  return 2;
});
$p.b5 = (function() {
  return "::";
});
$p.b4 = (function(n) {
  if ((n === 0)) {
    return this.gC;
  }
  if ((n === 1)) {
    return this.ap;
  }
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.o = (function() {
  return this.gC;
});
$p.bA = (function() {
  return new $c_s_Some(this.gC);
});
$p.s = (function() {
  return this.ap;
});
var $d_sci_$colon$colon = new $TypeData().i($c_sci_$colon$colon, "scala.collection.immutable.$colon$colon", ({
  g5: 1,
  aT: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  aM: 1,
  as: 1,
  aS: 1,
  aR: 1,
  l: 1,
  r: 1,
  bC: 1,
  B: 1,
  a: 1,
  V: 1,
  F: 1
}));
/** @constructor */
function $c_sci_Nil$() {
  $n_sci_Nil$ = this;
  var _1 = $m_sci_Nil$();
  $m_sci_Nil$();
}
$p = $c_sci_Nil$.prototype = new $h_sci_List();
$p.constructor = $c_sci_Nil$;
/** @constructor */
function $h_sci_Nil$() {
}
$h_sci_Nil$.prototype = $p;
$p.bJ = (function() {
  return new $c_s_Product$$anon$1(this);
});
$p.b3 = (function() {
  return 0;
});
$p.b5 = (function() {
  return "Nil";
});
$p.b4 = (function(n) {
  throw $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), ("" + n));
});
$p.pJ = (function() {
  throw new $c_ju_NoSuchElementException("head of empty list");
});
$p.r4 = (function() {
  throw new $c_jl_UnsupportedOperationException("tail of empty list");
});
$p.u = (function() {
  return 0;
});
$p.h = (function() {
  return $m_sc_Iterator$().P;
});
$p.o = (function() {
  this.pJ();
});
$p.bA = (function() {
  return $m_s_None$();
});
$p.s = (function() {
  this.r4();
});
var $d_sci_Nil$ = new $TypeData().i($c_sci_Nil$, "scala.collection.immutable.Nil$", ({
  gB: 1,
  aT: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  aM: 1,
  as: 1,
  aS: 1,
  aR: 1,
  l: 1,
  r: 1,
  bC: 1,
  B: 1,
  a: 1,
  V: 1,
  F: 1
}));
var $n_sci_Nil$;
function $m_sci_Nil$() {
  if ((!$n_sci_Nil$)) {
    $n_sci_Nil$ = new $c_sci_Nil$();
  }
  return $n_sci_Nil$;
}
/** @constructor */
function $c_sci_Vector0$() {
  this.d = null;
  this.f = null;
  this.g = 0;
  $ct_sci_BigVector__AO__AO__I__(this, $m_sci_VectorStatics$().im, $m_sci_VectorStatics$().im, 0);
}
$p = $c_sci_Vector0$.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector0$;
/** @constructor */
function $h_sci_Vector0$() {
}
$h_sci_Vector0$.prototype = $p;
$p.mD = (function(index) {
  throw this.az(index);
});
$p.dL = (function(index, elem) {
  throw this.az(index);
});
$p.dA = (function(elem) {
  var a = new $ac_O(1);
  a.a[0] = elem;
  return new $c_sci_Vector1(a);
});
$p.cu = (function() {
  return 0;
});
$p.ct = (function(idx) {
  return null;
});
$p.l = (function(o) {
  return ((this === o) || ((o instanceof $c_sci_Vector) ? false : $f_sc_Seq__equals__O__Z(this, o)));
});
$p.az = (function(index) {
  return $ct_jl_IndexOutOfBoundsException__T__(new $c_jl_IndexOutOfBoundsException(), (index + " is out of bounds (empty vector)"));
});
$p.q = (function(i) {
  this.mD(i);
});
$p.b = (function(v1) {
  this.mD((v1 | 0));
});
$p.K = (function(f) {
  return this;
});
var $d_sci_Vector0$ = new $TypeData().i($c_sci_Vector0$, "scala.collection.immutable.Vector0$", ({
  gK: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
var $n_sci_Vector0$;
function $m_sci_Vector0$() {
  if ((!$n_sci_Vector0$)) {
    $n_sci_Vector0$ = new $c_sci_Vector0$();
  }
  return $n_sci_Vector0$;
}
/** @constructor */
function $c_sci_Vector2(_prefix1, len1, data2, _suffix1, _length0) {
  this.d = null;
  this.f = null;
  this.g = 0;
  this.bw = 0;
  this.bd = null;
  this.bw = len1;
  this.bd = data2;
  $ct_sci_BigVector__AO__AO__I__(this, _prefix1, _suffix1, _length0);
}
$p = $c_sci_Vector2.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector2;
/** @constructor */
function $h_sci_Vector2() {
}
$h_sci_Vector2.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.bw) | 0);
    if ((io >= 0)) {
      var i2 = ((io >>> 5) | 0);
      var i1 = (31 & io);
      return ((i2 < this.bd.a.length) ? this.bd.a[i2].a[i1] : this.f.a[(31 & io)]);
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.g))) {
    if ((index >= this.bw)) {
      var io = ((index - this.bw) | 0);
      var i2 = ((io >>> 5) | 0);
      var i1 = (31 & io);
      if ((i2 < this.bd.a.length)) {
        var a2 = this.bd;
        var a2c = a2.e();
        var a1 = a2c.a[i2];
        var a1c = a1.e();
        a1c.a[i1] = elem;
        a2c.a[i2] = a1c;
        return new $c_sci_Vector2(this.d, this.bw, a2c, this.f, this.g);
      } else {
        var a1$1 = this.f;
        var a1c$1 = a1$1.e();
        a1c$1.a[i1] = elem;
        return new $c_sci_Vector2(this.d, this.bw, this.bd, a1c$1, this.g);
      }
    } else {
      var a1$2 = this.d;
      var a1c$2 = a1$2.e();
      a1c$2.a[index] = elem;
      return new $c_sci_Vector2(a1c$2, this.bw, this.bd, this.f, this.g);
    }
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.f.a.length < 32)) {
    var suffix1$3 = $m_sci_VectorStatics$().eP(this.f, elem);
    var length0$3 = ((1 + this.g) | 0);
    return new $c_sci_Vector2(this.d, this.bw, this.bd, suffix1$3, length0$3);
  } else if ((this.bd.a.length < 30)) {
    var data2$4 = $m_sci_VectorStatics$().z(this.bd, this.f);
    var a = new $ac_O(1);
    a.a[0] = elem;
    var length0$4 = ((1 + this.g) | 0);
    return new $c_sci_Vector2(this.d, this.bw, data2$4, a, length0$4);
  } else {
    var $x_5 = this.d;
    var $x_4 = this.bw;
    var $x_3 = this.bd;
    var $x_2 = this.bw;
    var $x_1 = $m_sci_VectorStatics$().cn;
    var x = this.f;
    var a$1 = new ($d_O.r().r().C)(1);
    a$1.a[0] = x;
    var a$2 = new $ac_O(1);
    a$2.a[0] = elem;
    return new $c_sci_Vector3($x_5, $x_4, $x_3, ((960 + $x_2) | 0), $x_1, a$1, a$2, ((1 + this.g) | 0));
  }
});
$p.ca = (function(f) {
  var prefix1$7 = $m_sci_VectorStatics$().bX(this.d, f);
  var data2$7 = $m_sci_VectorStatics$().W(2, this.bd, f);
  var suffix1$7 = $m_sci_VectorStatics$().bX(this.f, f);
  return new $c_sci_Vector2(prefix1$7, this.bw, data2$7, suffix1$7, this.g);
});
$p.cu = (function() {
  return 3;
});
$p.ct = (function(idx) {
  switch (idx) {
    case 0: {
      return this.d;
      break;
    }
    case 1: {
      return this.bd;
      break;
    }
    case 2: {
      return this.f;
      break;
    }
    default: {
      throw new $c_s_MatchError(idx);
    }
  }
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.bw) | 0);
    if ((io >= 0)) {
      var i2 = ((io >>> 5) | 0);
      var i1 = (31 & io);
      return ((i2 < this.bd.a.length) ? this.bd.a[i2].a[i1] : this.f.a[(31 & io)]);
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector2 = new $TypeData().i($c_sci_Vector2, "scala.collection.immutable.Vector2", ({
  gM: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
/** @constructor */
function $c_sci_Vector3(_prefix1, len1, prefix2, len12, data3, suffix2, _suffix1, _length0) {
  this.d = null;
  this.f = null;
  this.g = 0;
  this.b9 = 0;
  this.bj = null;
  this.ba = 0;
  this.aO = null;
  this.aP = null;
  this.b9 = len1;
  this.bj = prefix2;
  this.ba = len12;
  this.aO = data3;
  this.aP = suffix2;
  $ct_sci_BigVector__AO__AO__I__(this, _prefix1, _suffix1, _length0);
}
$p = $c_sci_Vector3.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector3;
/** @constructor */
function $h_sci_Vector3() {
}
$h_sci_Vector3.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.ba) | 0);
    if ((io >= 0)) {
      var i3 = ((io >>> 10) | 0);
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i3 < this.aO.a.length) ? this.aO.a[i3].a[i2].a[i1] : ((i2 < this.aP.a.length) ? this.aP.a[i2].a[i1] : this.f.a[i1]));
    } else if ((index >= this.b9)) {
      var io$2 = ((index - this.b9) | 0);
      return this.bj.a[((io$2 >>> 5) | 0)].a[(31 & io$2)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.g))) {
    if ((index >= this.ba)) {
      var io = ((index - this.ba) | 0);
      var i3 = ((io >>> 10) | 0);
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      if ((i3 < this.aO.a.length)) {
        var a3 = this.aO;
        var a3c = a3.e();
        var a2 = a3c.a[i3];
        var a2c = a2.e();
        var a1 = a2c.a[i2];
        var a1c = a1.e();
        a1c.a[i1] = elem;
        a2c.a[i2] = a1c;
        a3c.a[i3] = a2c;
        return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, a3c, this.aP, this.f, this.g);
      } else if ((i2 < this.aP.a.length)) {
        var a2$1 = this.aP;
        var a2c$1 = a2$1.e();
        var a1$1 = a2c$1.a[i2];
        var a1c$1 = a1$1.e();
        a1c$1.a[i1] = elem;
        a2c$1.a[i2] = a1c$1;
        return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, this.aO, a2c$1, this.f, this.g);
      } else {
        var a1$2 = this.f;
        var a1c$2 = a1$2.e();
        a1c$2.a[i1] = elem;
        return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, this.aO, this.aP, a1c$2, this.g);
      }
    } else if ((index >= this.b9)) {
      var io$2 = ((index - this.b9) | 0);
      var a2$2 = this.bj;
      var idx2 = ((io$2 >>> 5) | 0);
      var idx1 = (31 & io$2);
      var a2c$2 = a2$2.e();
      var a1$3 = a2c$2.a[idx2];
      var a1c$3 = a1$3.e();
      a1c$3.a[idx1] = elem;
      a2c$2.a[idx2] = a1c$3;
      return new $c_sci_Vector3(this.d, this.b9, a2c$2, this.ba, this.aO, this.aP, this.f, this.g);
    } else {
      var a1$4 = this.d;
      var a1c$4 = a1$4.e();
      a1c$4.a[index] = elem;
      return new $c_sci_Vector3(a1c$4, this.b9, this.bj, this.ba, this.aO, this.aP, this.f, this.g);
    }
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.f.a.length < 32)) {
    var suffix1$16 = $m_sci_VectorStatics$().eP(this.f, elem);
    var length0$16 = ((1 + this.g) | 0);
    return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, this.aO, this.aP, suffix1$16, length0$16);
  } else if ((this.aP.a.length < 31)) {
    var suffix2$6 = $m_sci_VectorStatics$().z(this.aP, this.f);
    var a = new $ac_O(1);
    a.a[0] = elem;
    var length0$17 = ((1 + this.g) | 0);
    return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, this.aO, suffix2$6, a, length0$17);
  } else if ((this.aO.a.length < 30)) {
    var data3$7 = $m_sci_VectorStatics$().z(this.aO, $m_sci_VectorStatics$().z(this.aP, this.f));
    var a$1 = new $ac_O(1);
    a$1.a[0] = elem;
    var length0$18 = ((1 + this.g) | 0);
    return new $c_sci_Vector3(this.d, this.b9, this.bj, this.ba, data3$7, $m_sci_VectorStatics$().bk, a$1, length0$18);
  } else {
    var $x_8 = this.d;
    var $x_7 = this.b9;
    var $x_6 = this.bj;
    var $x_5 = this.ba;
    var $x_4 = this.aO;
    var $x_3 = this.ba;
    var $x_2 = $m_sci_VectorStatics$().eI;
    var x = $m_sci_VectorStatics$().z(this.aP, this.f);
    var a$2 = new ($d_O.r().r().r().C)(1);
    a$2.a[0] = x;
    var $x_1 = $m_sci_VectorStatics$().bk;
    var a$3 = new $ac_O(1);
    a$3.a[0] = elem;
    return new $c_sci_Vector4($x_8, $x_7, $x_6, $x_5, $x_4, ((30720 + $x_3) | 0), $x_2, a$2, $x_1, a$3, ((1 + this.g) | 0));
  }
});
$p.ca = (function(f) {
  var prefix1$21 = $m_sci_VectorStatics$().bX(this.d, f);
  var prefix2$10 = $m_sci_VectorStatics$().W(2, this.bj, f);
  var data3$11 = $m_sci_VectorStatics$().W(3, this.aO, f);
  var suffix2$10 = $m_sci_VectorStatics$().W(2, this.aP, f);
  var suffix1$22 = $m_sci_VectorStatics$().bX(this.f, f);
  return new $c_sci_Vector3(prefix1$21, this.b9, prefix2$10, this.ba, data3$11, suffix2$10, suffix1$22, this.g);
});
$p.cu = (function() {
  return 5;
});
$p.ct = (function(idx) {
  switch (idx) {
    case 0: {
      return this.d;
      break;
    }
    case 1: {
      return this.bj;
      break;
    }
    case 2: {
      return this.aO;
      break;
    }
    case 3: {
      return this.aP;
      break;
    }
    case 4: {
      return this.f;
      break;
    }
    default: {
      throw new $c_s_MatchError(idx);
    }
  }
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.ba) | 0);
    if ((io >= 0)) {
      var i3 = ((io >>> 10) | 0);
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i3 < this.aO.a.length) ? this.aO.a[i3].a[i2].a[i1] : ((i2 < this.aP.a.length) ? this.aP.a[i2].a[i1] : this.f.a[i1]));
    } else if ((index >= this.b9)) {
      var io$2 = ((index - this.b9) | 0);
      return this.bj.a[((io$2 >>> 5) | 0)].a[(31 & io$2)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector3 = new $TypeData().i($c_sci_Vector3, "scala.collection.immutable.Vector3", ({
  gN: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
/** @constructor */
function $c_sci_Vector4(_prefix1, len1, prefix2, len12, prefix3, len123, data4, suffix3, suffix2, _suffix1, _length0) {
  this.d = null;
  this.f = null;
  this.g = 0;
  this.aC = 0;
  this.aY = null;
  this.aD = 0;
  this.aZ = null;
  this.aE = 0;
  this.ar = null;
  this.at = null;
  this.as = null;
  this.aC = len1;
  this.aY = prefix2;
  this.aD = len12;
  this.aZ = prefix3;
  this.aE = len123;
  this.ar = data4;
  this.at = suffix3;
  this.as = suffix2;
  $ct_sci_BigVector__AO__AO__I__(this, _prefix1, _suffix1, _length0);
}
$p = $c_sci_Vector4.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector4;
/** @constructor */
function $h_sci_Vector4() {
}
$h_sci_Vector4.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.aE) | 0);
    if ((io >= 0)) {
      var i4 = ((io >>> 15) | 0);
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i4 < this.ar.a.length) ? this.ar.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.at.a.length) ? this.at.a[i3].a[i2].a[i1] : ((i2 < this.as.a.length) ? this.as.a[i2].a[i1] : this.f.a[i1])));
    } else if ((index >= this.aD)) {
      var io$2 = ((index - this.aD) | 0);
      return this.aZ.a[((io$2 >>> 10) | 0)].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.aC)) {
      var io$3 = ((index - this.aC) | 0);
      return this.aY.a[((io$3 >>> 5) | 0)].a[(31 & io$3)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.g))) {
    if ((index >= this.aE)) {
      var io = ((index - this.aE) | 0);
      var i4 = ((io >>> 15) | 0);
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      if ((i4 < this.ar.a.length)) {
        var a4 = this.ar;
        var a4c = a4.e();
        var a3 = a4c.a[i4];
        var a3c = a3.e();
        var a2 = a3c.a[i3];
        var a2c = a2.e();
        var a1 = a2c.a[i2];
        var a1c = a1.e();
        a1c.a[i1] = elem;
        a2c.a[i2] = a1c;
        a3c.a[i3] = a2c;
        a4c.a[i4] = a3c;
        return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, a4c, this.at, this.as, this.f, this.g);
      } else if ((i3 < this.at.a.length)) {
        var a3$1 = this.at;
        var a3c$1 = a3$1.e();
        var a2$1 = a3c$1.a[i3];
        var a2c$1 = a2$1.e();
        var a1$1 = a2c$1.a[i2];
        var a1c$1 = a1$1.e();
        a1c$1.a[i1] = elem;
        a2c$1.a[i2] = a1c$1;
        a3c$1.a[i3] = a2c$1;
        return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, a3c$1, this.as, this.f, this.g);
      } else if ((i2 < this.as.a.length)) {
        var a2$2 = this.as;
        var a2c$2 = a2$2.e();
        var a1$2 = a2c$2.a[i2];
        var a1c$2 = a1$2.e();
        a1c$2.a[i1] = elem;
        a2c$2.a[i2] = a1c$2;
        return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, this.at, a2c$2, this.f, this.g);
      } else {
        var a1$3 = this.f;
        var a1c$3 = a1$3.e();
        a1c$3.a[i1] = elem;
        return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, this.at, this.as, a1c$3, this.g);
      }
    } else if ((index >= this.aD)) {
      var io$2 = ((index - this.aD) | 0);
      var a3$2 = this.aZ;
      var idx3 = ((io$2 >>> 10) | 0);
      var idx2 = (31 & ((io$2 >>> 5) | 0));
      var idx1 = (31 & io$2);
      var a3c$2 = a3$2.e();
      var a2$3 = a3c$2.a[idx3];
      var a2c$3 = a2$3.e();
      var a1$4 = a2c$3.a[idx2];
      var a1c$4 = a1$4.e();
      a1c$4.a[idx1] = elem;
      a2c$3.a[idx2] = a1c$4;
      a3c$2.a[idx3] = a2c$3;
      return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, a3c$2, this.aE, this.ar, this.at, this.as, this.f, this.g);
    } else if ((index >= this.aC)) {
      var io$3 = ((index - this.aC) | 0);
      var a2$4 = this.aY;
      var idx2$1 = ((io$3 >>> 5) | 0);
      var idx1$1 = (31 & io$3);
      var a2c$4 = a2$4.e();
      var a1$5 = a2c$4.a[idx2$1];
      var a1c$5 = a1$5.e();
      a1c$5.a[idx1$1] = elem;
      a2c$4.a[idx2$1] = a1c$5;
      return new $c_sci_Vector4(this.d, this.aC, a2c$4, this.aD, this.aZ, this.aE, this.ar, this.at, this.as, this.f, this.g);
    } else {
      var a1$6 = this.d;
      var a1c$6 = a1$6.e();
      a1c$6.a[index] = elem;
      return new $c_sci_Vector4(a1c$6, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, this.at, this.as, this.f, this.g);
    }
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.f.a.length < 32)) {
    var suffix1$33 = $m_sci_VectorStatics$().eP(this.f, elem);
    var length0$33 = ((1 + this.g) | 0);
    return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, this.at, this.as, suffix1$33, length0$33);
  } else if ((this.as.a.length < 31)) {
    var suffix2$22 = $m_sci_VectorStatics$().z(this.as, this.f);
    var a = new $ac_O(1);
    a.a[0] = elem;
    var length0$34 = ((1 + this.g) | 0);
    return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, this.at, suffix2$22, a, length0$34);
  } else if ((this.at.a.length < 31)) {
    var suffix3$9 = $m_sci_VectorStatics$().z(this.at, $m_sci_VectorStatics$().z(this.as, this.f));
    var a$1 = new $ac_O(1);
    a$1.a[0] = elem;
    var length0$35 = ((1 + this.g) | 0);
    return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, this.ar, suffix3$9, $m_sci_VectorStatics$().bk, a$1, length0$35);
  } else if ((this.ar.a.length < 30)) {
    var data4$10 = $m_sci_VectorStatics$().z(this.ar, $m_sci_VectorStatics$().z(this.at, $m_sci_VectorStatics$().z(this.as, this.f)));
    var a$2 = new $ac_O(1);
    a$2.a[0] = elem;
    var length0$36 = ((1 + this.g) | 0);
    return new $c_sci_Vector4(this.d, this.aC, this.aY, this.aD, this.aZ, this.aE, data4$10, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$2, length0$36);
  } else {
    var $x_11 = this.d;
    var $x_10 = this.aC;
    var $x_9 = this.aY;
    var $x_8 = this.aD;
    var $x_7 = this.aZ;
    var $x_6 = this.aE;
    var $x_5 = this.ar;
    var $x_4 = this.aE;
    var $x_3 = $m_sci_VectorStatics$().io;
    var x = $m_sci_VectorStatics$().z(this.at, $m_sci_VectorStatics$().z(this.as, this.f));
    var a$3 = new ($d_O.r().r().r().r().C)(1);
    a$3.a[0] = x;
    var $x_2 = $m_sci_VectorStatics$().cn;
    var $x_1 = $m_sci_VectorStatics$().bk;
    var a$4 = new $ac_O(1);
    a$4.a[0] = elem;
    return new $c_sci_Vector5($x_11, $x_10, $x_9, $x_8, $x_7, $x_6, $x_5, ((983040 + $x_4) | 0), $x_3, a$3, $x_2, $x_1, a$4, ((1 + this.g) | 0));
  }
});
$p.ca = (function(f) {
  var prefix1$39 = $m_sci_VectorStatics$().bX(this.d, f);
  var prefix2$27 = $m_sci_VectorStatics$().W(2, this.aY, f);
  var prefix3$14 = $m_sci_VectorStatics$().W(3, this.aZ, f);
  var data4$15 = $m_sci_VectorStatics$().W(4, this.ar, f);
  var suffix3$14 = $m_sci_VectorStatics$().W(3, this.at, f);
  var suffix2$27 = $m_sci_VectorStatics$().W(2, this.as, f);
  var suffix1$41 = $m_sci_VectorStatics$().bX(this.f, f);
  return new $c_sci_Vector4(prefix1$39, this.aC, prefix2$27, this.aD, prefix3$14, this.aE, data4$15, suffix3$14, suffix2$27, suffix1$41, this.g);
});
$p.cu = (function() {
  return 7;
});
$p.ct = (function(idx) {
  switch (idx) {
    case 0: {
      return this.d;
      break;
    }
    case 1: {
      return this.aY;
      break;
    }
    case 2: {
      return this.aZ;
      break;
    }
    case 3: {
      return this.ar;
      break;
    }
    case 4: {
      return this.at;
      break;
    }
    case 5: {
      return this.as;
      break;
    }
    case 6: {
      return this.f;
      break;
    }
    default: {
      throw new $c_s_MatchError(idx);
    }
  }
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.aE) | 0);
    if ((io >= 0)) {
      var i4 = ((io >>> 15) | 0);
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i4 < this.ar.a.length) ? this.ar.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.at.a.length) ? this.at.a[i3].a[i2].a[i1] : ((i2 < this.as.a.length) ? this.as.a[i2].a[i1] : this.f.a[i1])));
    } else if ((index >= this.aD)) {
      var io$2 = ((index - this.aD) | 0);
      return this.aZ.a[((io$2 >>> 10) | 0)].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.aC)) {
      var io$3 = ((index - this.aC) | 0);
      return this.aY.a[((io$3 >>> 5) | 0)].a[(31 & io$3)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector4 = new $TypeData().i($c_sci_Vector4, "scala.collection.immutable.Vector4", ({
  gO: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
/** @constructor */
function $c_sci_Vector5(_prefix1, len1, prefix2, len12, prefix3, len123, prefix4, len1234, data5, suffix4, suffix3, suffix2, _suffix1, _length0) {
  this.d = null;
  this.f = null;
  this.g = 0;
  this.ag = 0;
  this.au = null;
  this.ah = 0;
  this.av = null;
  this.ai = 0;
  this.aw = null;
  this.aj = 0;
  this.a1 = null;
  this.a4 = null;
  this.a3 = null;
  this.a2 = null;
  this.ag = len1;
  this.au = prefix2;
  this.ah = len12;
  this.av = prefix3;
  this.ai = len123;
  this.aw = prefix4;
  this.aj = len1234;
  this.a1 = data5;
  this.a4 = suffix4;
  this.a3 = suffix3;
  this.a2 = suffix2;
  $ct_sci_BigVector__AO__AO__I__(this, _prefix1, _suffix1, _length0);
}
$p = $c_sci_Vector5.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector5;
/** @constructor */
function $h_sci_Vector5() {
}
$h_sci_Vector5.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.aj) | 0);
    if ((io >= 0)) {
      var i5 = ((io >>> 20) | 0);
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i5 < this.a1.a.length) ? this.a1.a[i5].a[i4].a[i3].a[i2].a[i1] : ((i4 < this.a4.a.length) ? this.a4.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.a3.a.length) ? this.a3.a[i3].a[i2].a[i1] : ((i2 < this.a2.a.length) ? this.a2.a[i2].a[i1] : this.f.a[i1]))));
    } else if ((index >= this.ai)) {
      var io$2 = ((index - this.ai) | 0);
      return this.aw.a[((io$2 >>> 15) | 0)].a[(31 & ((io$2 >>> 10) | 0))].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.ah)) {
      var io$3 = ((index - this.ah) | 0);
      return this.av.a[((io$3 >>> 10) | 0)].a[(31 & ((io$3 >>> 5) | 0))].a[(31 & io$3)];
    } else if ((index >= this.ag)) {
      var io$4 = ((index - this.ag) | 0);
      return this.au.a[((io$4 >>> 5) | 0)].a[(31 & io$4)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.g))) {
    if ((index >= this.aj)) {
      var io = ((index - this.aj) | 0);
      var i5 = ((io >>> 20) | 0);
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      if ((i5 < this.a1.a.length)) {
        var a5 = this.a1;
        var a5c = a5.e();
        var a4 = a5c.a[i5];
        var a4c = a4.e();
        var a3 = a4c.a[i4];
        var a3c = a3.e();
        var a2 = a3c.a[i3];
        var a2c = a2.e();
        var a1 = a2c.a[i2];
        var a1c = a1.e();
        a1c.a[i1] = elem;
        a2c.a[i2] = a1c;
        a3c.a[i3] = a2c;
        a4c.a[i4] = a3c;
        a5c.a[i5] = a4c;
        return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, a5c, this.a4, this.a3, this.a2, this.f, this.g);
      } else if ((i4 < this.a4.a.length)) {
        var a4$1 = this.a4;
        var a4c$1 = a4$1.e();
        var a3$1 = a4c$1.a[i4];
        var a3c$1 = a3$1.e();
        var a2$1 = a3c$1.a[i3];
        var a2c$1 = a2$1.e();
        var a1$1 = a2c$1.a[i2];
        var a1c$1 = a1$1.e();
        a1c$1.a[i1] = elem;
        a2c$1.a[i2] = a1c$1;
        a3c$1.a[i3] = a2c$1;
        a4c$1.a[i4] = a3c$1;
        return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, a4c$1, this.a3, this.a2, this.f, this.g);
      } else if ((i3 < this.a3.a.length)) {
        var a3$2 = this.a3;
        var a3c$2 = a3$2.e();
        var a2$2 = a3c$2.a[i3];
        var a2c$2 = a2$2.e();
        var a1$2 = a2c$2.a[i2];
        var a1c$2 = a1$2.e();
        a1c$2.a[i1] = elem;
        a2c$2.a[i2] = a1c$2;
        a3c$2.a[i3] = a2c$2;
        return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, a3c$2, this.a2, this.f, this.g);
      } else if ((i2 < this.a2.a.length)) {
        var a2$3 = this.a2;
        var a2c$3 = a2$3.e();
        var a1$3 = a2c$3.a[i2];
        var a1c$3 = a1$3.e();
        a1c$3.a[i1] = elem;
        a2c$3.a[i2] = a1c$3;
        return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, a2c$3, this.f, this.g);
      } else {
        var a1$4 = this.f;
        var a1c$4 = a1$4.e();
        a1c$4.a[i1] = elem;
        return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, this.a2, a1c$4, this.g);
      }
    } else if ((index >= this.ai)) {
      var io$2 = ((index - this.ai) | 0);
      var a4$2 = this.aw;
      var idx4 = ((io$2 >>> 15) | 0);
      var idx3 = (31 & ((io$2 >>> 10) | 0));
      var idx2 = (31 & ((io$2 >>> 5) | 0));
      var idx1 = (31 & io$2);
      var a4c$2 = a4$2.e();
      var a3$3 = a4c$2.a[idx4];
      var a3c$3 = a3$3.e();
      var a2$4 = a3c$3.a[idx3];
      var a2c$4 = a2$4.e();
      var a1$5 = a2c$4.a[idx2];
      var a1c$5 = a1$5.e();
      a1c$5.a[idx1] = elem;
      a2c$4.a[idx2] = a1c$5;
      a3c$3.a[idx3] = a2c$4;
      a4c$2.a[idx4] = a3c$3;
      return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, a4c$2, this.aj, this.a1, this.a4, this.a3, this.a2, this.f, this.g);
    } else if ((index >= this.ah)) {
      var io$3 = ((index - this.ah) | 0);
      var a3$4 = this.av;
      var idx3$1 = ((io$3 >>> 10) | 0);
      var idx2$1 = (31 & ((io$3 >>> 5) | 0));
      var idx1$1 = (31 & io$3);
      var a3c$4 = a3$4.e();
      var a2$5 = a3c$4.a[idx3$1];
      var a2c$5 = a2$5.e();
      var a1$6 = a2c$5.a[idx2$1];
      var a1c$6 = a1$6.e();
      a1c$6.a[idx1$1] = elem;
      a2c$5.a[idx2$1] = a1c$6;
      a3c$4.a[idx3$1] = a2c$5;
      return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, a3c$4, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, this.a2, this.f, this.g);
    } else if ((index >= this.ag)) {
      var io$4 = ((index - this.ag) | 0);
      var a2$6 = this.au;
      var idx2$2 = ((io$4 >>> 5) | 0);
      var idx1$2 = (31 & io$4);
      var a2c$6 = a2$6.e();
      var a1$7 = a2c$6.a[idx2$2];
      var a1c$7 = a1$7.e();
      a1c$7.a[idx1$2] = elem;
      a2c$6.a[idx2$2] = a1c$7;
      return new $c_sci_Vector5(this.d, this.ag, a2c$6, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, this.a2, this.f, this.g);
    } else {
      var a1$8 = this.d;
      var a1c$8 = a1$8.e();
      a1c$8.a[index] = elem;
      return new $c_sci_Vector5(a1c$8, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, this.a2, this.f, this.g);
    }
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.f.a.length < 32)) {
    var suffix1$54 = $m_sci_VectorStatics$().eP(this.f, elem);
    var length0$54 = ((1 + this.g) | 0);
    return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, this.a2, suffix1$54, length0$54);
  } else if ((this.a2.a.length < 31)) {
    var suffix2$41 = $m_sci_VectorStatics$().z(this.a2, this.f);
    var a = new $ac_O(1);
    a.a[0] = elem;
    var length0$55 = ((1 + this.g) | 0);
    return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, this.a3, suffix2$41, a, length0$55);
  } else if ((this.a3.a.length < 31)) {
    var suffix3$29 = $m_sci_VectorStatics$().z(this.a3, $m_sci_VectorStatics$().z(this.a2, this.f));
    var a$1 = new $ac_O(1);
    a$1.a[0] = elem;
    var length0$56 = ((1 + this.g) | 0);
    return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, this.a4, suffix3$29, $m_sci_VectorStatics$().bk, a$1, length0$56);
  } else if ((this.a4.a.length < 31)) {
    var suffix4$12 = $m_sci_VectorStatics$().z(this.a4, $m_sci_VectorStatics$().z(this.a3, $m_sci_VectorStatics$().z(this.a2, this.f)));
    var a$2 = new $ac_O(1);
    a$2.a[0] = elem;
    var length0$57 = ((1 + this.g) | 0);
    return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, this.a1, suffix4$12, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$2, length0$57);
  } else if ((this.a1.a.length < 30)) {
    var data5$13 = $m_sci_VectorStatics$().z(this.a1, $m_sci_VectorStatics$().z(this.a4, $m_sci_VectorStatics$().z(this.a3, $m_sci_VectorStatics$().z(this.a2, this.f))));
    var a$3 = new $ac_O(1);
    a$3.a[0] = elem;
    var length0$58 = ((1 + this.g) | 0);
    return new $c_sci_Vector5(this.d, this.ag, this.au, this.ah, this.av, this.ai, this.aw, this.aj, data5$13, $m_sci_VectorStatics$().eI, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$3, length0$58);
  } else {
    var $x_14 = this.d;
    var $x_13 = this.ag;
    var $x_12 = this.au;
    var $x_11 = this.ah;
    var $x_10 = this.av;
    var $x_9 = this.ai;
    var $x_8 = this.aw;
    var $x_7 = this.aj;
    var $x_6 = this.a1;
    var $x_5 = this.aj;
    var $x_4 = $m_sci_VectorStatics$().m5;
    var x = $m_sci_VectorStatics$().z(this.a4, $m_sci_VectorStatics$().z(this.a3, $m_sci_VectorStatics$().z(this.a2, this.f)));
    var a$4 = new ($d_O.r().r().r().r().r().C)(1);
    a$4.a[0] = x;
    var $x_3 = $m_sci_VectorStatics$().eI;
    var $x_2 = $m_sci_VectorStatics$().cn;
    var $x_1 = $m_sci_VectorStatics$().bk;
    var a$5 = new $ac_O(1);
    a$5.a[0] = elem;
    return new $c_sci_Vector6($x_14, $x_13, $x_12, $x_11, $x_10, $x_9, $x_8, $x_7, $x_6, ((31457280 + $x_5) | 0), $x_4, a$4, $x_3, $x_2, $x_1, a$5, ((1 + this.g) | 0));
  }
});
$p.ca = (function(f) {
  var prefix1$61 = $m_sci_VectorStatics$().bX(this.d, f);
  var prefix2$47 = $m_sci_VectorStatics$().W(2, this.au, f);
  var prefix3$35 = $m_sci_VectorStatics$().W(3, this.av, f);
  var prefix4$18 = $m_sci_VectorStatics$().W(4, this.aw, f);
  var data5$19 = $m_sci_VectorStatics$().W(5, this.a1, f);
  var suffix4$18 = $m_sci_VectorStatics$().W(4, this.a4, f);
  var suffix3$35 = $m_sci_VectorStatics$().W(3, this.a3, f);
  var suffix2$47 = $m_sci_VectorStatics$().W(2, this.a2, f);
  var suffix1$64 = $m_sci_VectorStatics$().bX(this.f, f);
  return new $c_sci_Vector5(prefix1$61, this.ag, prefix2$47, this.ah, prefix3$35, this.ai, prefix4$18, this.aj, data5$19, suffix4$18, suffix3$35, suffix2$47, suffix1$64, this.g);
});
$p.cu = (function() {
  return 9;
});
$p.ct = (function(idx) {
  switch (idx) {
    case 0: {
      return this.d;
      break;
    }
    case 1: {
      return this.au;
      break;
    }
    case 2: {
      return this.av;
      break;
    }
    case 3: {
      return this.aw;
      break;
    }
    case 4: {
      return this.a1;
      break;
    }
    case 5: {
      return this.a4;
      break;
    }
    case 6: {
      return this.a3;
      break;
    }
    case 7: {
      return this.a2;
      break;
    }
    case 8: {
      return this.f;
      break;
    }
    default: {
      throw new $c_s_MatchError(idx);
    }
  }
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.aj) | 0);
    if ((io >= 0)) {
      var i5 = ((io >>> 20) | 0);
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i5 < this.a1.a.length) ? this.a1.a[i5].a[i4].a[i3].a[i2].a[i1] : ((i4 < this.a4.a.length) ? this.a4.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.a3.a.length) ? this.a3.a[i3].a[i2].a[i1] : ((i2 < this.a2.a.length) ? this.a2.a[i2].a[i1] : this.f.a[i1]))));
    } else if ((index >= this.ai)) {
      var io$2 = ((index - this.ai) | 0);
      return this.aw.a[((io$2 >>> 15) | 0)].a[(31 & ((io$2 >>> 10) | 0))].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.ah)) {
      var io$3 = ((index - this.ah) | 0);
      return this.av.a[((io$3 >>> 10) | 0)].a[(31 & ((io$3 >>> 5) | 0))].a[(31 & io$3)];
    } else if ((index >= this.ag)) {
      var io$4 = ((index - this.ag) | 0);
      return this.au.a[((io$4 >>> 5) | 0)].a[(31 & io$4)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector5 = new $TypeData().i($c_sci_Vector5, "scala.collection.immutable.Vector5", ({
  gP: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
/** @constructor */
function $c_sci_Vector6(_prefix1, len1, prefix2, len12, prefix3, len123, prefix4, len1234, prefix5, len12345, data6, suffix5, suffix4, suffix3, suffix2, _suffix1, _length0) {
  this.d = null;
  this.f = null;
  this.g = 0;
  this.a5 = 0;
  this.ak = null;
  this.a6 = 0;
  this.al = null;
  this.a7 = 0;
  this.am = null;
  this.a8 = 0;
  this.an = null;
  this.ad = 0;
  this.R = null;
  this.V = null;
  this.U = null;
  this.T = null;
  this.S = null;
  this.a5 = len1;
  this.ak = prefix2;
  this.a6 = len12;
  this.al = prefix3;
  this.a7 = len123;
  this.am = prefix4;
  this.a8 = len1234;
  this.an = prefix5;
  this.ad = len12345;
  this.R = data6;
  this.V = suffix5;
  this.U = suffix4;
  this.T = suffix3;
  this.S = suffix2;
  $ct_sci_BigVector__AO__AO__I__(this, _prefix1, _suffix1, _length0);
}
$p = $c_sci_Vector6.prototype = new $h_sci_BigVector();
$p.constructor = $c_sci_Vector6;
/** @constructor */
function $h_sci_Vector6() {
}
$h_sci_Vector6.prototype = $p;
$p.q = (function(index) {
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.ad) | 0);
    if ((io >= 0)) {
      var i6 = ((io >>> 25) | 0);
      var i5 = (31 & ((io >>> 20) | 0));
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i6 < this.R.a.length) ? this.R.a[i6].a[i5].a[i4].a[i3].a[i2].a[i1] : ((i5 < this.V.a.length) ? this.V.a[i5].a[i4].a[i3].a[i2].a[i1] : ((i4 < this.U.a.length) ? this.U.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.T.a.length) ? this.T.a[i3].a[i2].a[i1] : ((i2 < this.S.a.length) ? this.S.a[i2].a[i1] : this.f.a[i1])))));
    } else if ((index >= this.a8)) {
      var io$2 = ((index - this.a8) | 0);
      return this.an.a[((io$2 >>> 20) | 0)].a[(31 & ((io$2 >>> 15) | 0))].a[(31 & ((io$2 >>> 10) | 0))].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.a7)) {
      var io$3 = ((index - this.a7) | 0);
      return this.am.a[((io$3 >>> 15) | 0)].a[(31 & ((io$3 >>> 10) | 0))].a[(31 & ((io$3 >>> 5) | 0))].a[(31 & io$3)];
    } else if ((index >= this.a6)) {
      var io$4 = ((index - this.a6) | 0);
      return this.al.a[((io$4 >>> 10) | 0)].a[(31 & ((io$4 >>> 5) | 0))].a[(31 & io$4)];
    } else if ((index >= this.a5)) {
      var io$5 = ((index - this.a5) | 0);
      return this.ak.a[((io$5 >>> 5) | 0)].a[(31 & io$5)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.dL = (function(index, elem) {
  if (((index >= 0) && (index < this.g))) {
    if ((index >= this.ad)) {
      var io = ((index - this.ad) | 0);
      var i6 = ((io >>> 25) | 0);
      var i5 = (31 & ((io >>> 20) | 0));
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      if ((i6 < this.R.a.length)) {
        var a6 = this.R;
        var a6c = a6.e();
        var a5 = a6c.a[i6];
        var a5c = a5.e();
        var a4 = a5c.a[i5];
        var a4c = a4.e();
        var a3 = a4c.a[i4];
        var a3c = a3.e();
        var a2 = a3c.a[i3];
        var a2c = a2.e();
        var a1 = a2c.a[i2];
        var a1c = a1.e();
        a1c.a[i1] = elem;
        a2c.a[i2] = a1c;
        a3c.a[i3] = a2c;
        a4c.a[i4] = a3c;
        a5c.a[i5] = a4c;
        a6c.a[i6] = a5c;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, a6c, this.V, this.U, this.T, this.S, this.f, this.g);
      } else if ((i5 < this.V.a.length)) {
        var a5$1 = this.V;
        var a5c$1 = a5$1.e();
        var a4$1 = a5c$1.a[i5];
        var a4c$1 = a4$1.e();
        var a3$1 = a4c$1.a[i4];
        var a3c$1 = a3$1.e();
        var a2$1 = a3c$1.a[i3];
        var a2c$1 = a2$1.e();
        var a1$1 = a2c$1.a[i2];
        var a1c$1 = a1$1.e();
        a1c$1.a[i1] = elem;
        a2c$1.a[i2] = a1c$1;
        a3c$1.a[i3] = a2c$1;
        a4c$1.a[i4] = a3c$1;
        a5c$1.a[i5] = a4c$1;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, a5c$1, this.U, this.T, this.S, this.f, this.g);
      } else if ((i4 < this.U.a.length)) {
        var a4$2 = this.U;
        var a4c$2 = a4$2.e();
        var a3$2 = a4c$2.a[i4];
        var a3c$2 = a3$2.e();
        var a2$2 = a3c$2.a[i3];
        var a2c$2 = a2$2.e();
        var a1$2 = a2c$2.a[i2];
        var a1c$2 = a1$2.e();
        a1c$2.a[i1] = elem;
        a2c$2.a[i2] = a1c$2;
        a3c$2.a[i3] = a2c$2;
        a4c$2.a[i4] = a3c$2;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, a4c$2, this.T, this.S, this.f, this.g);
      } else if ((i3 < this.T.a.length)) {
        var a3$3 = this.T;
        var a3c$3 = a3$3.e();
        var a2$3 = a3c$3.a[i3];
        var a2c$3 = a2$3.e();
        var a1$3 = a2c$3.a[i2];
        var a1c$3 = a1$3.e();
        a1c$3.a[i1] = elem;
        a2c$3.a[i2] = a1c$3;
        a3c$3.a[i3] = a2c$3;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, a3c$3, this.S, this.f, this.g);
      } else if ((i2 < this.S.a.length)) {
        var a2$4 = this.S;
        var a2c$4 = a2$4.e();
        var a1$4 = a2c$4.a[i2];
        var a1c$4 = a1$4.e();
        a1c$4.a[i1] = elem;
        a2c$4.a[i2] = a1c$4;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, a2c$4, this.f, this.g);
      } else {
        var a1$5 = this.f;
        var a1c$5 = a1$5.e();
        a1c$5.a[i1] = elem;
        return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, a1c$5, this.g);
      }
    } else if ((index >= this.a8)) {
      var io$2 = ((index - this.a8) | 0);
      var a5$2 = this.an;
      var idx5 = ((io$2 >>> 20) | 0);
      var idx4 = (31 & ((io$2 >>> 15) | 0));
      var idx3 = (31 & ((io$2 >>> 10) | 0));
      var idx2 = (31 & ((io$2 >>> 5) | 0));
      var idx1 = (31 & io$2);
      var a5c$2 = a5$2.e();
      var a4$3 = a5c$2.a[idx5];
      var a4c$3 = a4$3.e();
      var a3$4 = a4c$3.a[idx4];
      var a3c$4 = a3$4.e();
      var a2$5 = a3c$4.a[idx3];
      var a2c$5 = a2$5.e();
      var a1$6 = a2c$5.a[idx2];
      var a1c$6 = a1$6.e();
      a1c$6.a[idx1] = elem;
      a2c$5.a[idx2] = a1c$6;
      a3c$4.a[idx3] = a2c$5;
      a4c$3.a[idx4] = a3c$4;
      a5c$2.a[idx5] = a4c$3;
      return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, a5c$2, this.ad, this.R, this.V, this.U, this.T, this.S, this.f, this.g);
    } else if ((index >= this.a7)) {
      var io$3 = ((index - this.a7) | 0);
      var a4$4 = this.am;
      var idx4$1 = ((io$3 >>> 15) | 0);
      var idx3$1 = (31 & ((io$3 >>> 10) | 0));
      var idx2$1 = (31 & ((io$3 >>> 5) | 0));
      var idx1$1 = (31 & io$3);
      var a4c$4 = a4$4.e();
      var a3$5 = a4c$4.a[idx4$1];
      var a3c$5 = a3$5.e();
      var a2$6 = a3c$5.a[idx3$1];
      var a2c$6 = a2$6.e();
      var a1$7 = a2c$6.a[idx2$1];
      var a1c$7 = a1$7.e();
      a1c$7.a[idx1$1] = elem;
      a2c$6.a[idx2$1] = a1c$7;
      a3c$5.a[idx3$1] = a2c$6;
      a4c$4.a[idx4$1] = a3c$5;
      return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, a4c$4, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, this.f, this.g);
    } else if ((index >= this.a6)) {
      var io$4 = ((index - this.a6) | 0);
      var a3$6 = this.al;
      var idx3$2 = ((io$4 >>> 10) | 0);
      var idx2$2 = (31 & ((io$4 >>> 5) | 0));
      var idx1$2 = (31 & io$4);
      var a3c$6 = a3$6.e();
      var a2$7 = a3c$6.a[idx3$2];
      var a2c$7 = a2$7.e();
      var a1$8 = a2c$7.a[idx2$2];
      var a1c$8 = a1$8.e();
      a1c$8.a[idx1$2] = elem;
      a2c$7.a[idx2$2] = a1c$8;
      a3c$6.a[idx3$2] = a2c$7;
      return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, a3c$6, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, this.f, this.g);
    } else if ((index >= this.a5)) {
      var io$5 = ((index - this.a5) | 0);
      var a2$8 = this.ak;
      var idx2$3 = ((io$5 >>> 5) | 0);
      var idx1$3 = (31 & io$5);
      var a2c$8 = a2$8.e();
      var a1$9 = a2c$8.a[idx2$3];
      var a1c$9 = a1$9.e();
      a1c$9.a[idx1$3] = elem;
      a2c$8.a[idx2$3] = a1c$9;
      return new $c_sci_Vector6(this.d, this.a5, a2c$8, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, this.f, this.g);
    } else {
      var a1$10 = this.d;
      var a1c$10 = a1$10.e();
      a1c$10.a[index] = elem;
      return new $c_sci_Vector6(a1c$10, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, this.f, this.g);
    }
  } else {
    throw this.az(index);
  }
});
$p.dA = (function(elem) {
  if ((this.f.a.length < 32)) {
    var suffix1$79 = $m_sci_VectorStatics$().eP(this.f, elem);
    var length0$79 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, this.S, suffix1$79, length0$79);
  } else if ((this.S.a.length < 31)) {
    var suffix2$63 = $m_sci_VectorStatics$().z(this.S, this.f);
    var a = new $ac_O(1);
    a.a[0] = elem;
    var length0$80 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, this.T, suffix2$63, a, length0$80);
  } else if ((this.T.a.length < 31)) {
    var suffix3$52 = $m_sci_VectorStatics$().z(this.T, $m_sci_VectorStatics$().z(this.S, this.f));
    var a$1 = new $ac_O(1);
    a$1.a[0] = elem;
    var length0$81 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, this.U, suffix3$52, $m_sci_VectorStatics$().bk, a$1, length0$81);
  } else if ((this.U.a.length < 31)) {
    var suffix4$36 = $m_sci_VectorStatics$().z(this.U, $m_sci_VectorStatics$().z(this.T, $m_sci_VectorStatics$().z(this.S, this.f)));
    var a$2 = new $ac_O(1);
    a$2.a[0] = elem;
    var length0$82 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, this.V, suffix4$36, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$2, length0$82);
  } else if ((this.V.a.length < 31)) {
    var suffix5$15 = $m_sci_VectorStatics$().z(this.V, $m_sci_VectorStatics$().z(this.U, $m_sci_VectorStatics$().z(this.T, $m_sci_VectorStatics$().z(this.S, this.f))));
    var a$3 = new $ac_O(1);
    a$3.a[0] = elem;
    var length0$83 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, this.R, suffix5$15, $m_sci_VectorStatics$().eI, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$3, length0$83);
  } else if ((this.R.a.length < 62)) {
    var data6$16 = $m_sci_VectorStatics$().z(this.R, $m_sci_VectorStatics$().z(this.V, $m_sci_VectorStatics$().z(this.U, $m_sci_VectorStatics$().z(this.T, $m_sci_VectorStatics$().z(this.S, this.f)))));
    var a$4 = new $ac_O(1);
    a$4.a[0] = elem;
    var length0$84 = ((1 + this.g) | 0);
    return new $c_sci_Vector6(this.d, this.a5, this.ak, this.a6, this.al, this.a7, this.am, this.a8, this.an, this.ad, data6$16, $m_sci_VectorStatics$().io, $m_sci_VectorStatics$().eI, $m_sci_VectorStatics$().cn, $m_sci_VectorStatics$().bk, a$4, length0$84);
  } else {
    throw $ct_jl_IllegalArgumentException__(new $c_jl_IllegalArgumentException());
  }
});
$p.ca = (function(f) {
  var prefix1$87 = $m_sci_VectorStatics$().bX(this.d, f);
  var prefix2$70 = $m_sci_VectorStatics$().W(2, this.ak, f);
  var prefix3$59 = $m_sci_VectorStatics$().W(3, this.al, f);
  var prefix4$43 = $m_sci_VectorStatics$().W(4, this.am, f);
  var prefix5$22 = $m_sci_VectorStatics$().W(5, this.an, f);
  var data6$23 = $m_sci_VectorStatics$().W(6, this.R, f);
  var suffix5$22 = $m_sci_VectorStatics$().W(5, this.V, f);
  var suffix4$43 = $m_sci_VectorStatics$().W(4, this.U, f);
  var suffix3$59 = $m_sci_VectorStatics$().W(3, this.T, f);
  var suffix2$70 = $m_sci_VectorStatics$().W(2, this.S, f);
  var suffix1$91 = $m_sci_VectorStatics$().bX(this.f, f);
  return new $c_sci_Vector6(prefix1$87, this.a5, prefix2$70, this.a6, prefix3$59, this.a7, prefix4$43, this.a8, prefix5$22, this.ad, data6$23, suffix5$22, suffix4$43, suffix3$59, suffix2$70, suffix1$91, this.g);
});
$p.cu = (function() {
  return 11;
});
$p.ct = (function(idx) {
  switch (idx) {
    case 0: {
      return this.d;
      break;
    }
    case 1: {
      return this.ak;
      break;
    }
    case 2: {
      return this.al;
      break;
    }
    case 3: {
      return this.am;
      break;
    }
    case 4: {
      return this.an;
      break;
    }
    case 5: {
      return this.R;
      break;
    }
    case 6: {
      return this.V;
      break;
    }
    case 7: {
      return this.U;
      break;
    }
    case 8: {
      return this.T;
      break;
    }
    case 9: {
      return this.S;
      break;
    }
    case 10: {
      return this.f;
      break;
    }
    default: {
      throw new $c_s_MatchError(idx);
    }
  }
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  if (((index >= 0) && (index < this.g))) {
    var io = ((index - this.ad) | 0);
    if ((io >= 0)) {
      var i6 = ((io >>> 25) | 0);
      var i5 = (31 & ((io >>> 20) | 0));
      var i4 = (31 & ((io >>> 15) | 0));
      var i3 = (31 & ((io >>> 10) | 0));
      var i2 = (31 & ((io >>> 5) | 0));
      var i1 = (31 & io);
      return ((i6 < this.R.a.length) ? this.R.a[i6].a[i5].a[i4].a[i3].a[i2].a[i1] : ((i5 < this.V.a.length) ? this.V.a[i5].a[i4].a[i3].a[i2].a[i1] : ((i4 < this.U.a.length) ? this.U.a[i4].a[i3].a[i2].a[i1] : ((i3 < this.T.a.length) ? this.T.a[i3].a[i2].a[i1] : ((i2 < this.S.a.length) ? this.S.a[i2].a[i1] : this.f.a[i1])))));
    } else if ((index >= this.a8)) {
      var io$2 = ((index - this.a8) | 0);
      return this.an.a[((io$2 >>> 20) | 0)].a[(31 & ((io$2 >>> 15) | 0))].a[(31 & ((io$2 >>> 10) | 0))].a[(31 & ((io$2 >>> 5) | 0))].a[(31 & io$2)];
    } else if ((index >= this.a7)) {
      var io$3 = ((index - this.a7) | 0);
      return this.am.a[((io$3 >>> 15) | 0)].a[(31 & ((io$3 >>> 10) | 0))].a[(31 & ((io$3 >>> 5) | 0))].a[(31 & io$3)];
    } else if ((index >= this.a6)) {
      var io$4 = ((index - this.a6) | 0);
      return this.al.a[((io$4 >>> 10) | 0)].a[(31 & ((io$4 >>> 5) | 0))].a[(31 & io$4)];
    } else if ((index >= this.a5)) {
      var io$5 = ((index - this.a5) | 0);
      return this.ak.a[((io$5 >>> 5) | 0)].a[(31 & io$5)];
    } else {
      return this.d.a[index];
    }
  } else {
    throw this.az(index);
  }
});
$p.K = (function(f) {
  return this.ca(f);
});
var $d_sci_Vector6 = new $TypeData().i($c_sci_Vector6, "scala.collection.immutable.Vector6", ({
  gQ: 1,
  ad: 1,
  ae: 1,
  aa: 1,
  z: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  s: 1,
  y: 1,
  x: 1,
  o: 1,
  q: 1,
  D: 1,
  A: 1,
  l: 1,
  r: 1,
  B: 1,
  a: 1,
  V: 1
}));
function $ct_scm_StringBuilder__jl_StringBuilder__($thiz, underlying) {
  $thiz.aS = underlying;
  return $thiz;
}
function $ct_scm_StringBuilder__($thiz) {
  $ct_scm_StringBuilder__jl_StringBuilder__($thiz, $ct_jl_StringBuilder__(new $c_jl_StringBuilder()));
  return $thiz;
}
/** @constructor */
function $c_scm_StringBuilder() {
  this.aS = null;
}
$p = $c_scm_StringBuilder.prototype = new $h_scm_AbstractSeq();
$p.constructor = $c_scm_StringBuilder;
/** @constructor */
function $h_scm_StringBuilder() {
}
$h_scm_StringBuilder.prototype = $p;
$p.aT = (function(elems) {
  return $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, elems);
});
$p.b6 = (function(size) {
});
$p.h = (function() {
  return $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(this));
});
$p.K = (function(f) {
  return $f_sc_IndexedSeqOps__map__F1__O(this, f);
});
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.aS.m();
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.bb = (function() {
  return "IndexedSeq";
});
$p.m = (function() {
  return this.aS.m();
});
$p.u = (function() {
  return this.aS.m();
});
$p.ok = (function(x) {
  var this$1 = this.aS;
  var str = ("" + $cToS(x));
  this$1.n = (this$1.n + str);
  return this;
});
$p.p = (function() {
  return this.aS.n;
});
$p.mB = (function(xs) {
  if (false) {
    var this$3 = this.aS;
    var str = xs.ri;
    this$3.n = (("" + this$3.n) + str);
  } else if ((xs instanceof $c_scm_ArraySeq$ofChar)) {
    this.aS.mA(xs.bG);
  } else if ((xs instanceof $c_scm_StringBuilder)) {
    var this$4 = this.aS;
    var s = xs.aS;
    this$4.n = (("" + this$4.n) + s);
  } else {
    var ks = xs.u();
    if ((ks !== 0)) {
      var b = this.aS;
      if ((ks > 0)) {
        b.m();
      }
      var it = xs.h();
      while (it.j()) {
        var c = $uC(it.i());
        var str$1 = ("" + $cToS(c));
        b.n = (b.n + str$1);
      }
    }
  }
  return this;
});
$p.c = (function() {
  return (this.aS.m() === 0);
});
$p.q = (function(i) {
  return $bC(this.aS.mJ(i));
});
$p.b = (function(v1) {
  var i = (v1 | 0);
  return $bC(this.aS.mJ(i));
});
$p.g1 = (function(coll) {
  return $ct_scm_StringBuilder__(new $c_scm_StringBuilder()).mB(coll);
});
$p.g0 = (function(coll) {
  return $ct_scm_StringBuilder__(new $c_scm_StringBuilder()).mB(coll);
});
$p.aU = (function(elem) {
  return this.ok($uC(elem));
});
$p.aV = (function() {
  return this.aS.n;
});
$p.b1 = (function() {
  return $m_scm_IndexedSeq$();
});
function $isArrayOf_scm_StringBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.cb)));
}
var $d_scm_StringBuilder = new $TypeData().i($c_scm_StringBuilder, "scala.collection.mutable.StringBuilder", ({
  cb: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  H: 1,
  J: 1,
  M: 1,
  ab: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  aI: 1,
  a: 1
}));
function $isArrayOf_scm_LinkedHashMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.hh)));
}
function $p_scm_ListBuffer__copyElems__V($thiz) {
  var buf = new $c_scm_ListBuffer().hb($thiz);
  $thiz.bT = buf.bT;
  $thiz.cN = buf.cN;
  $thiz.gF = false;
}
function $p_scm_ListBuffer__ensureUnaliased__V($thiz) {
  $thiz.gG = ((1 + $thiz.gG) | 0);
  if ($thiz.gF) {
    $p_scm_ListBuffer__copyElems__V($thiz);
  }
}
/** @constructor */
function $c_scm_ListBuffer() {
  this.gG = 0;
  this.bT = null;
  this.cN = null;
  this.gF = false;
  this.bU = 0;
  this.gG = 0;
  this.bT = $m_sci_Nil$();
  this.cN = null;
  this.gF = false;
  this.bU = 0;
}
$p = $c_scm_ListBuffer.prototype = new $h_scm_AbstractBuffer();
$p.constructor = $c_scm_ListBuffer;
/** @constructor */
function $h_scm_ListBuffer() {
}
$h_scm_ListBuffer.prototype = $p;
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.c7 = (function(f) {
  return $f_sc_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.b6 = (function(size) {
});
$p.h = (function() {
  return new $c_scm_MutationTracker$CheckedIterator(this.bT.h(), new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.gG)));
});
$p.dJ = (function() {
  return $m_scm_ListBuffer$();
});
$p.q = (function(i) {
  return $f_sc_LinearSeqOps__apply__I__O(this.bT, i);
});
$p.m = (function() {
  return this.bU;
});
$p.u = (function() {
  return this.bU;
});
$p.c = (function() {
  return (this.bU === 0);
});
$p.ei = (function() {
  this.gF = (!this.c());
  return this.bT;
});
$p.os = (function(elem) {
  $p_scm_ListBuffer__ensureUnaliased__V(this);
  var last1 = new $c_sci_$colon$colon(elem, $m_sci_Nil$());
  if ((this.bU === 0)) {
    this.bT = last1;
  } else {
    var x$proxy2 = this.cN;
    if ((x$proxy2 === null)) {
      $m_sr_Scala3RunTime$().cr();
    }
    x$proxy2.ap = last1;
  }
  this.cN = last1;
  this.bU = ((1 + this.bU) | 0);
  return this;
});
$p.hb = (function(xs) {
  var it = xs.h();
  if (it.j()) {
    var len = 1;
    var last0 = new $c_sci_$colon$colon(it.i(), $m_sci_Nil$());
    this.bT = last0;
    while (it.j()) {
      var last1 = new $c_sci_$colon$colon(it.i(), $m_sci_Nil$());
      last0.ap = last1;
      last0 = last1;
      len = ((1 + len) | 0);
    }
    this.bU = len;
    this.cN = last0;
  }
  return this;
});
$p.oj = (function(xs) {
  var it = xs.h();
  if (it.j()) {
    var fresh = new $c_scm_ListBuffer().hb(it);
    $p_scm_ListBuffer__ensureUnaliased__V(this);
    if ((this.bU === 0)) {
      this.bT = fresh.bT;
    } else {
      var x$proxy3 = this.cN;
      if ((x$proxy3 === null)) {
        $m_sr_Scala3RunTime$().cr();
      }
      x$proxy3.ap = fresh.bT;
    }
    this.cN = fresh.cN;
    this.bU = ((this.bU + fresh.bU) | 0);
  }
  return this;
});
$p.bb = (function() {
  return "ListBuffer";
});
$p.b1 = (function() {
  return $m_scm_ListBuffer$();
});
$p.b = (function(v1) {
  var i = (v1 | 0);
  return $f_sc_LinearSeqOps__apply__I__O(this.bT, i);
});
$p.aV = (function() {
  return this.ei();
});
$p.aU = (function(elem) {
  return this.os(elem);
});
$p.aT = (function(elems) {
  return this.oj(elems);
});
function $isArrayOf_scm_ListBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.ca)));
}
var $d_scm_ListBuffer = new $TypeData().i($c_scm_ListBuffer, "scala.collection.mutable.ListBuffer", ({
  ca: 1,
  aV: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  H: 1,
  J: 1,
  aA: 1,
  aW: 1,
  l: 1,
  r: 1,
  M: 1,
  ab: 1,
  a: 1,
  V: 1
}));
function $ct_scm_ArrayBuffer__AO__I__($thiz, initialElements, initialSize) {
  $thiz.eJ = 0;
  $thiz.cJ = initialElements;
  $thiz.b0 = initialSize;
  return $thiz;
}
function $ct_scm_ArrayBuffer__($thiz) {
  $ct_scm_ArrayBuffer__AO__I__($thiz, new $ac_O(16), 0);
  return $thiz;
}
/** @constructor */
function $c_scm_ArrayBuffer() {
  this.eJ = 0;
  this.cJ = null;
  this.b0 = 0;
}
$p = $c_scm_ArrayBuffer.prototype = new $h_scm_AbstractBuffer();
$p.constructor = $c_scm_ArrayBuffer;
/** @constructor */
function $h_scm_ArrayBuffer() {
}
$h_scm_ArrayBuffer.prototype = $p;
$p.h = (function() {
  return this.rf().h();
});
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = this.b0;
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.K = (function(f) {
  return $f_sc_StrictOptimizedIterableOps__map__F1__O(this, f);
});
$p.c7 = (function(f) {
  return $f_sc_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.u = (function() {
  return this.b0;
});
$p.iP = (function(n) {
  this.cJ = $m_scm_ArrayBuffer$().nA(this.cJ, this.b0, n);
});
$p.b6 = (function(size) {
  if (((size > this.b0) && (size >= 1))) {
    this.iP(size);
  }
});
$p.q = (function(n) {
  var hi = ((1 + n) | 0);
  if ((n < 0)) {
    throw $m_scg_CommonErrors$().j7(n, ((this.b0 - 1) | 0));
  }
  if ((hi > this.b0)) {
    throw $m_scg_CommonErrors$().j7(((hi - 1) | 0), ((this.b0 - 1) | 0));
  }
  return this.cJ.a[n];
});
$p.m = (function() {
  return this.b0;
});
$p.rf = (function() {
  return new $c_scm_ArrayBufferView(this, new $c_sr_AbstractFunction0_$$Lambda$07eded5776954a9c145e92c329afd52873ad179c((() => this.eJ)));
});
$p.dJ = (function() {
  return $m_scm_ArrayBuffer$();
});
$p.op = (function(elem) {
  this.eJ = ((1 + this.eJ) | 0);
  var newSize = ((1 + this.b0) | 0);
  if ((this.cJ.a.length <= ((newSize - 1) | 0))) {
    this.iP(newSize);
  }
  this.b0 = newSize;
  this.cJ.a[((newSize - 1) | 0)] = elem;
  return this;
});
$p.mv = (function(elems) {
  if ((elems instanceof $c_scm_ArrayBuffer)) {
    var elemsLength = elems.b0;
    if ((elemsLength > 0)) {
      this.eJ = ((1 + this.eJ) | 0);
      this.iP(((this.b0 + elemsLength) | 0));
      $m_s_Array$().fW(elems.cJ, 0, this.cJ, this.b0, elemsLength);
      this.b0 = ((this.b0 + elemsLength) | 0);
    }
  } else {
    $f_scm_Growable__addAll__sc_IterableOnce__scm_Growable(this, elems);
  }
  return this;
});
$p.bb = (function() {
  return "ArrayBuffer";
});
$p.by = (function(xs, start, len) {
  var srcLen = this.b0;
  var destLen = $m_jl_reflect_Array$().bI(xs);
  var limit = ((len < srcLen) ? len : srcLen);
  var capacity = ((start < 0) ? destLen : ((destLen - start) | 0));
  var total = ((capacity < limit) ? capacity : limit);
  var copied = ((total < 0) ? 0 : total);
  if ((copied > 0)) {
    $m_s_Array$().fW(this.cJ, 0, xs, start, copied);
  }
  return copied;
});
$p.b = (function(v1) {
  return this.q((v1 | 0));
});
$p.b1 = (function() {
  return $m_scm_ArrayBuffer$();
});
$p.aU = (function(elem) {
  return this.op(elem);
});
$p.aT = (function(elems) {
  return this.mv(elems);
});
function $isArrayOf_scm_ArrayBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.D === depth)) && obj.$classData.B.n.bX)));
}
var $d_scm_ArrayBuffer = new $TypeData().i($c_scm_ArrayBuffer, "scala.collection.mutable.ArrayBuffer", ({
  bX: 1,
  aV: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  H: 1,
  J: 1,
  aA: 1,
  aW: 1,
  o: 1,
  q: 1,
  T: 1,
  S: 1,
  c9: 1,
  l: 1,
  r: 1,
  a: 1,
  V: 1
}));
function $ct_sjs_js_WrappedArray__sjs_js_Array__($thiz, array) {
  $thiz.dv = array;
  return $thiz;
}
function $ct_sjs_js_WrappedArray__($thiz) {
  $ct_sjs_js_WrappedArray__sjs_js_Array__($thiz, []);
  return $thiz;
}
/** @constructor */
function $c_sjs_js_WrappedArray() {
  this.dv = null;
}
$p = $c_sjs_js_WrappedArray.prototype = new $h_scm_AbstractBuffer();
$p.constructor = $c_sjs_js_WrappedArray;
/** @constructor */
function $h_sjs_js_WrappedArray() {
}
$h_sjs_js_WrappedArray.prototype = $p;
$p.b6 = (function(size) {
});
$p.bb = (function() {
  return "IndexedSeq";
});
$p.h = (function() {
  return $ct_sc_IndexedSeqView$IndexedSeqViewIterator__sc_IndexedSeqView__(new $c_sc_IndexedSeqView$IndexedSeqViewIterator(), new $c_sc_IndexedSeqView$Id(this));
});
$p.K = (function(f) {
  return $f_sc_IndexedSeqOps__map__F1__O(this, f);
});
$p.o = (function() {
  return $f_sc_IndexedSeqOps__head__O(this);
});
$p.bA = (function() {
  return $f_sc_IndexedSeqOps__headOption__s_Option(this);
});
$p.b2 = (function(len) {
  var x = (this.dv.length | 0);
  return ((x === len) ? 0 : ((x < len) ? (-1) : 1));
});
$p.c7 = (function(f) {
  return $f_sc_StrictOptimizedSeqOps__distinctBy__F1__O(this, f);
});
$p.dJ = (function() {
  return $m_sjs_js_WrappedArray$();
});
$p.q = (function(index) {
  return this.dv[index];
});
$p.m = (function() {
  return (this.dv.length | 0);
});
$p.u = (function() {
  return (this.dv.length | 0);
});
$p.bH = (function() {
  return "WrappedArray";
});
$p.aV = (function() {
  return this;
});
$p.aU = (function(elem) {
  this.dv.push(elem);
  return this;
});
$p.b = (function(v1) {
  var index = (v1 | 0);
  return this.dv[index];
});
$p.b1 = (function() {
  return $m_sjs_js_WrappedArray$();
});
var $d_sjs_js_WrappedArray = new $TypeData().i($c_sjs_js_WrappedArray, "scala.scalajs.js.WrappedArray", ({
  i8: 1,
  aV: 1,
  L: 1,
  p: 1,
  i: 1,
  b: 1,
  c: 1,
  g: 1,
  f: 1,
  e: 1,
  h: 1,
  j: 1,
  k: 1,
  d: 1,
  m: 1,
  K: 1,
  C: 1,
  I: 1,
  O: 1,
  N: 1,
  H: 1,
  J: 1,
  aA: 1,
  aW: 1,
  r: 1,
  l: 1,
  S: 1,
  o: 1,
  q: 1,
  T: 1,
  c9: 1,
  M: 1,
  a: 1
}));
let $e_mount = (function(arg, arg$2, arg$3) {
  return $m_Lnotebook_plugin_NotebookPlugin$().qj(arg, arg$2, arg$3);
});
export { $e_mount as mount };
$s_Lapothecary_Main__main__AT__V(new ($d_T.r().C)([]));
