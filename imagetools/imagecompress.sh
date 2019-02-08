echo "Compressing images"
find "." -name '*.png' -exec "./pngquant" --verbose --ext .png --force {} \;