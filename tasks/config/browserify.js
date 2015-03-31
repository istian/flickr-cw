module.exports = function (grunt) {
  grunt.config.set("browserify", {
    ".tmp/public/js/importer.js": ".tmp/public/js/importer.js"
  });

  grunt.loadNpmTasks("grunt-browserify");
};
