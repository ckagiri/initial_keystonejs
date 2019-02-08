if [ ! -d "plugins" ]; then
    mkdir plugins
fi
cd plugins
while getopts ":n:p:t:" opt; do
  case $opt in
    n)
      _n=${OPTARG};;
    p)
      _p=${OPTARG};;
    t)
      _t=${OPTARG};;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done
if [ -z "$_n" ]
then
    echo "name not found"
    exit 1
fi
if [ -z "$_p" ]; then
    echo "path not found"
    exit 1
fi

if [ -d "$_n" ]; then
    #remove existing files
    rm -rf $_n
fi

git clone $_p $_n
cd $_n
if [ ! -z "$_t" ]; then
    git checkout tags/$_t
fi
npm install
node install.js
