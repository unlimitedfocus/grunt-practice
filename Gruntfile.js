module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    sass: {
      dev: {
        files: {
          'app/css/main.css': 'src/**/*.scss'
        }
      }
    },
    watch: {
      css: {
        files: 'src/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: 'src/**/*.html',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    // not working
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'src/**/*.{html,js,css}'
          ]
        },
        options: {
          watchTask: true,
          server: './app'
        }
      }
    },
    qunit: {
      files: ['test/**/*.html', '!test/performance/**/*']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/performance/**/*'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    /*
    proxy: {
      options: {
        hostname: '*',
        port: 9000,
        middleware: function(connect, options, middlewares) {
          middlewares.unshift(require('grunt-connect-prism/middleware'));
          middlewares.unshift(function (req, res, next) {
            console.log('proxy', req.url);

            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Headers', 'accept, x-version, content-type, authorization');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
            res.setHeader('Access-Control-Expose-Headers', 'X-Version, X-Maintenance-Mode');
            res.setHeader('Access-Control-Max-Age', '1728000');

            next();
          });
          return middlewares;
        }
      }
    },
    http://randonom.com/blog/2014/06/record-mock-and-proxy-http-requests-with-grunt-connect-prism/
    prism: {
      options: {
        mode: 'record',
        mocksPath: 'mocks',
        host: 'localhost',
        port: 3000,
        https: false,
        context: '/'
      }
    },
    prism: {
      options: {
        mode: 'proxy',
        mocksPath: './mocks',
        context: '/api',
        host: 'www.google.co.kr',
        port: 80,
        https: false
      }
    },
    connect: {
      // [site] https://github.com/gruntjs/grunt-contrib-connect
      server: {
        options: {
          port: 3001,
          keepalive: true,
          base: {
            path: 'app'
          },
          middleware: function (connect, options) {
            var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
            return [
              proxy,
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        },
        proxies: [
          {
            context: '/api',
            host: 'www.google.com',
            port: 80
          }
        ]
      }
    },
    prism: {
      options: {
        name: 'api',
        mode: 'proxy',
        context: '/api',
        host: 'localhost',
        port: 3000
      }
    },
    */
    connect: {
      options: {
        hostname: 'localhost',
        port: 3001,
        keepalive: true,
        debug: true,
        base: {
          path: 'app'
        }
      },
      proxyserver: {
        proxies: [
          {
            context: '/api',
            host: 'www.jobplanet.co.kr',
            port: 443,
            https: true
            // host: 'www.google.com',
            // port: 80
          }
        ]
      }
    },
    sitespeedio: {
      // [site] https://github.com/sitespeedio/grunt-sitespeedio
      default: {
        options: {
          urls: ['http://www.jobplanet.co.kr/'],
          resultBaseDir: './test/performance',
          browser: 'chrome',  // Firefox or Chrome
          connection: 'cable' // mobile3g, mobile3gfast, cable and native
        }
      }
    },
    pagespeed: {
      // [site] https://github.com/jrcryer/grunt-pagespeed
      options: {
        nokey: true,
        url: "https://developers.google.com"
      },
      prod: {
        options: {
          url: "http://www.jobplanet.co.kr",
          locale: "ko_KR",
          strategy: "desktop", // desktop and mobile
          threshold: 50
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-connect-prism');

  grunt.loadNpmTasks('grunt-sitespeedio');
  grunt.loadNpmTasks('grunt-pagespeed');

  grunt.registerTask('performance', ['pagespeed', 'sitespeedio']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['sass', 'concat', 'uglify']);
  grunt.registerTask('dist', ['concat', 'uglify']);
  grunt.registerTask('server', ['prism', 'configureProxies:proxyserver', 'connect']);
};


