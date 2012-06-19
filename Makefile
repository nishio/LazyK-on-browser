# settings for this project
CLOSURE_LIB = /Users/nishio/cur/jscc/client/thirdparty/closure-library
CALCDEPS = $(CLOSURE_LIB)/closure/bin/calcdeps.py
CLOSURE_BUILDER = $(CLOSURE_LIB)/closure/bin/build/closurebuilder.py
CLOSURE_COMPILER = /Users/nishio/cur/jscc/client/thirdparty/compiler.jar
LIBPATH = js $(CLOSURE_LIB)
ENTRYPOINT = js/main.js
EXTERNS =
JS_FILES = js/deps.js

# automatic settings
LIBPATH_FOR_CALCDEPS = $(patsubst %,-p %, $(LIBPATH))
LIBPATH_FOR_BUILDER = $(patsubst %,--root="%", $(LIBPATH))
EXTERNS_FOR_BUILDER = $(patsubst %,--compiler_flags="--externs=%", $(EXTERNS))
JS_FILES_FOR_BUILDER = $(patsubst %,--compiler_flags="--js=%", $(JS_FILES))

# targets
deps: js/deps.js .jscc/deps.txt

js/deps.js:
	$(CALCDEPS) -i $(ENTRYPOINT) -o deps $(LIBPATH_FOR_CALCDEPS) > js/deps.js

.jscc/deps.txt:
	$(CALCDEPS) -i $(ENTRYPOINT) -o list $(LIBPATH_FOR_CALCDEPS) > .jscc/deps.txt

watch-start:
	cd .jscc; python watch.py

watch-stop:
	kill `cat .jscc/watch.pid`
	-rm .jscc/watch.pid

watch: .jscc/deps.txt
	./build.sh
	cat .jscc/deps.txt | xargs watchmedo shell-command --command="./build.sh" &

lint: .jscc/deps.txt
	-cat .jscc/deps.txt | xargs gjslint > .jscc/new_lint.log 2> /dev/null
	mv .jscc/new_lint.log .jscc/lint.log
	cat .jscc/lint.log

compile: js/deps.js
	-$(CLOSURE_BUILDER) \
	    --namespace="main.main" \
	    $(LIBPATH_FOR_BUILDER) \
	    $(EXTERNS_FOR_BUILDER) \
	    $(JS_FILES_FOR_BUILDER) \
	    --output_mode=compiled --compiler_jar="$(CLOSURE_COMPILER)" \
	    -f --compilation_level=ADVANCED_OPTIMIZATIONS \
	    -f --warning_level=VERBOSE \
	    -f --jscomp_warning=visibility \
	    > /dev/null 2> .jscc/new_compile.log
	mv .jscc/new_compile.log .jscc/compile.log
	cat .jscc/compile.log

report:
	@cat .jscc/lint.log
	@cat .jscc/compile.log
	cd .jscc; python client.py


# for flymake
check-syntax:
	cat .jscc/compile.log


# test welknown problems
conftest:
	-ls $(CLOSURE_LIB)
	-ls $(CALCDEPS)
	-ls $(CLOSURE_BUILDER)
	-ls $(CLOSURE_COMPILER)
	-ls $(ENTRYPOINT)