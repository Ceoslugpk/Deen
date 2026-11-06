const esbuild=require('esbuild');
esbuild.buildSync({entryPoints:[process.argv[2]],bundle:true,outfile:process.argv[3],
  platform:'node',format:'cjs',target:'node18',external:['react-native','react','expo*','@expo*','@react-native*'],
  loader:{'.ts':'ts','.tsx':'tsx','.json':'json'},logLevel:'error'});
