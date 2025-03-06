files="";

# lint-staged will pass all files in $1 $2 $3 etc. iterate and concat.
for var in "$@"
do
    files="$files \"$var\","
done

# create temporary tsconfig which includes only passed files
str="{
  \"extends\": \"./tsconfig.json\",
  \"include\": [
    $files
  ]
}"
echo $str > tsconfig.tmp

# run typecheck using temp config
pnpm tsc -p ./tsconfig.tmp --noEmit

# capture exit code of tsc
code=$?

# delete temp config
rm ./tsconfig.tmp

exit $code
