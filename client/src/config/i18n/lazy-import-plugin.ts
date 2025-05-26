import { BackendModule } from "i18next";

const LazyImportPlugin: BackendModule = {
  type: "backend",
  init: function () {},
  read: function (language, namespace, callback) {
    import(`/public/locales/${language}/${namespace}.json`).then(obj => {
      callback(null, obj);
    });
  },
};

export default LazyImportPlugin;
