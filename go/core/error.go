package core

type JoplinError struct {
	IsJoplinError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewJoplinError(code string, msg string, ctx *Context) *JoplinError {
	return &JoplinError{
		IsJoplinError: true,
		Sdk:              "Joplin",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *JoplinError) Error() string {
	return e.Msg
}
