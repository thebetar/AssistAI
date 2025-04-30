function FormInput({ value, setValue, label }) {
	return (
		<div class="mb-3 max-w-xl">
			<label class="block ml-1 mb-1 font-semibold text-base" for="model">
				{label}
			</label>
			<input
				name="model"
				value={value()}
				onInput={e => setValue(e.target.value)}
				class="px-3 py-2 border border-zinc-500 rounded-md w-full"
			/>
		</div>
	);
}

export default FormInput;
