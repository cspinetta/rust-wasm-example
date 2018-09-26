
.PHONY: build
.PHONY: functions.wasm

build: functions.wasm

functions.wasm:
	cargo build --target wasm32-unknown-unknown --release
	cp target/wasm32-unknown-unknown/release/hello_rust.wasm $@

