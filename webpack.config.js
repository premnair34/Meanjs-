var webpack = require('webpack'),
path = require("path"),
ExtractTextPlugin = require('extract-text-webpack-plugin');
HtmlWebpackPlugin = require('html-webpack-plugin');
var config = {
  context:path.join( __dirname,'public'),
  addVendor: function (name, path) {
      this.resolve.alias[name] = path;
      this.module.noParse.push(new RegExp(path));
  },
   entry:  {
      app:[
        "webpack-dev-server/client?http://localhost:8080",
        "webpack/hot/only-dev-server",
        "./index.js"
      ],
      //vendors: ['jquery','angular']
  },
  output:{
  path:path.join( __dirname,'app'),
  filename:"bundle.js",
  publicPath: "http://localhost:8080/" // development
  //publicPath: "https://www.adminsuite.com/" // production
  },
  watch:true,
  devtool: 'source-map',
  resolve:{
    /*alias:{     
      jquery: "jquery/src/jquery"
    },*/
    extensions:['.js','.css','.less','.html']
  },
  module:{
    loaders:[
      {
      test: /\.js$/,       
      loader: 'babel-loader',
      query: {
        presets: ["es2015"], 
        compact: false 
      },
      exclude: '/node_modules/'
      },  
      {
        test: /\.less$/,
        loader:ExtractTextPlugin.extract(['css','less'])        
      },   
      { 
        test: /\.css$/,
        loader:ExtractTextPlugin.extract(['css'])
      },  
      {
        test: /\.html$/,
        loader: "html?config=otherHtmlLoaderConfig"
      },
      //{test: /bootstrap\/js\//, loader:'imports?jQuery=jquery'}, 
      {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader:'url-loader',query:{limit:100000}},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      {test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },        
    ]
  }, 
  plugins: [
    //new webpack.ProvidePlugin({$: "jquery",jQuery: "jquery"}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
   new ExtractTextPlugin({ filename:'style.css', disable: false, allChunks: true }),  
   // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js'}),
    new HtmlWebpackPlugin({template:path.join(__dirname,'pulic','index.html')})    
   
  ],
 devServer:{
    inline:true,
    colors:true,
    stats:'erros',
    hot: true,
    port:8080
  },
};
module.exports = config; 