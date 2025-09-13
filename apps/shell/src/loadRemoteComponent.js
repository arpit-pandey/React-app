// Utility to dynamically load a remote component via Module Federation

import React, { lazy } from 'react';

function waitForRemote(scope, retries = 20, interval = 250) {
  return new Promise((resolve, reject) => {
    function check() {
      if (window[scope]) {
        resolve(window[scope]);
      } else if (retries > 0) {
        setTimeout(check, interval);
        retries--;
      } else {
        reject(new Error(`Remote ${scope} not found on window`));
      }
    }
    check();
  });
}

export function loadRemoteComponent(scope, module) {
  return lazy(() =>
    waitForRemote(scope).then(remote => {
      // Handle both Promise and non-Promise return from init
      const initResult = remote.init(__webpack_share_scopes__.default);
      const initPromise = initResult && typeof initResult.then === 'function' 
        ? initResult 
        : Promise.resolve();
      
      return initPromise.then(() =>
        remote.get(module).then(factory => {
          const Module = factory();
          // Ensure we return the default export or the module itself
          return { default: Module.default || Module };
        })
      );
    })
  );
}
