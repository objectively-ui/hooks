export const deepEqual = <T>(left: T, right: T): boolean => {
  if (Array.isArray(left)) {
    if (!Array.isArray(right)) {
      return false;
    }

    if (left.length !== right.length) {
      return false;
    }

    for (let i = 0; i < left.length; ++i) {
      if (!deepEqual(left[i], right[i])) {
        return false;
      }
    }

    return true;
  }

  if (left && typeof left === "object") {
    if (!right || typeof right !== "object") {
      return false;
    }

    if (Object.keys(left).length !== Object.keys(right).length) {
      return false;
    }

    if (Object.keys(left).some((key) => !Object.hasOwn(right, key))) {
      return false;
    }

    for (const k in left) {
      if (!deepEqual(left[k], right[k])) {
        return false;
      }
    }

    return true;
  }

  if (left && typeof left === "function") {
    if (!right || typeof right !== "function") {
      return false;
    }

    return left.toString() === right.toString();
  }

  return left === right;
};
