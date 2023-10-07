import { Form, Input, Typography, Button, message } from "antd"
import { useNavigate } from "react-router-dom"
import { setUser } from "../Redux/Features/userSlice"
import { useDispatch } from "react-redux"

const username = 'ozinpic'
const password = 'Neo2006@'
const expired_time = 3600000

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submit = (values) => {
        if(values.username === username && values.password === password) {
            localStorage.setItem('time', Date.now() + expired_time)
            dispatch(setUser({
                name: 'ozinpic'
            }))
            navigate('/home')
            message.success("Đăng nhập thành công")
        } else {
            message.error("Sai tên đăng nhập hoặc mật khẩu")
        }
    }

    return (
        <Form
            onFinish={submit}
            layout="vertical"
            style={{
                padding: 10
            }}
        >
            <Typography.Title
                className='text-center'
            >Đăng nhập</Typography.Title>

            <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Cần có' }]}
            >
                <Input placeholder="Tên đăng nhập của bạn" />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Cần có' }]}
            >
                <Input placeholder="Mật khẩu của bạn" />
            </Form.Item>

            <Button type='primary' htmlType='submit'>Đăng nhập</Button>
        </Form>
    )
}

export default Login