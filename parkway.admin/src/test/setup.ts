/* eslint-disable @typescript-eslint/no-empty-function */
/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    };
  };
