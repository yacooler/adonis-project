import vine from '@vinejs/vine'

const speakerValidator = vine
    .compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255)
    })
);

export default speakerValidator;