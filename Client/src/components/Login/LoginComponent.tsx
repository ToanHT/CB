import * as React from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import store from "./_store";
// import __state from "./_models";
import { action_Login, action_UsernameValidate, action_PasswordValidate } from "./_actions";
import { LoginViewModel } from "src/models/LoginViewModel";
import { Unsubscribe } from "redux";
import { fakeAuth } from "src/commons/constant";
interface IState {
    IsAuth: boolean;
    LoginViewModel: LoginViewModel;
    Username_Invalid: boolean;
    Password_Invalid: boolean;
    Username_Invalid_MSG: string;
    Password_Invalid_MSG: string;
}

export class LoginComponent extends React.Component<any, IState> {
    private unsubscribe: Unsubscribe;
    componentWillMount() {
        let storeState = store.getState();
        this.setState({
            LoginViewModel: {
                UserName: storeState !== undefined ? storeState.Model.UserName : "",
                Password: "",
                IsRememberMe: false
            } 
        });
        this.unsubscribe = store.subscribe(() => {
            if (storeState !== undefined) {
                if (this.state.IsAuth !== storeState.IsAuth
                    || this.state.Username_Invalid !== storeState.Username_Invalid
                    || this.state.Username_Invalid_MSG !== storeState.Username_Invalid_MSG
                    || this.state.Password_Invalid !== storeState.Password_Invalid
                    || this.state.Password_Invalid_MSG !== storeState.Password_Invalid_MSG) {
                    this.setState({
                        IsAuth: storeState.IsAuth,
                        Password_Invalid: storeState.Password_Invalid,
                        Username_Invalid: storeState.Username_Invalid,
                        Username_Invalid_MSG: storeState.Username_Invalid_MSG,
                        Password_Invalid_MSG: storeState.Password_Invalid_MSG
                    });
                }
            }
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        const { referrer } = this.props.location.state || { referrer: { pathname: "/" } };
        if (this.state.IsAuth) {
            fakeAuth.authenticate();
            return <Redirect to={referrer}/>;
        }
        return (
            <div id="extr-page">
                <header id="header">
                    <div id="logo-group">
                        <span id="logo"> <img src="/assets/img/logo.png" alt="SmartAdmin" /> </span>
                    </div>
                    <span id="extr-page-header-space"> <span className="hidden-mobile hiddex-xs">Bạn chưa có tài khoản?</span> <Link to="/register" className="btn btn-danger">Tạo tài khoản</Link> </span>
                </header>
                <div id="main" role="main">
                    <div id="content" className="container">
                        <div className="row" style={{ display: "flex", justifyContent: "center" }}>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <div className="well no-padding">
                                    <div id="login-form" className="smart-form client-form">
                                        <header>Đăng nhập</header>
                                        <fieldset>
                                            <section>
                                                <label className="label">Tài khoản</label>
                                                <label className="input"> <i className="icon-append fa fa-user"></i>
                                                    <input type="email" name="email"
                                                        value={this.state.LoginViewModel.UserName || ""}
                                                        onChange={v => this.setState({
                                                            LoginViewModel: {
                                                                UserName: v.target["value"],
                                                                Password: this.state.LoginViewModel.Password,
                                                                Remember: this.state.LoginViewModel.IsRememberMe
                                                            }
                                                        }, () => store.dispatch(action_UsernameValidate(this.state.LoginViewModel.UserName)))} />

                                                    {this.state.Username_Invalid ? <em id="email-error" className="invalid">{this.state.Username_Invalid_MSG}</em> : null}
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal"></i> Vui lòng nhập tài khoản của bạn</b></label>
                                            </section>

                                            <section>
                                                <label className="label">Mật khẩu</label>
                                                <label className="input"> <i className="icon-append fa fa-lock"></i>
                                                    <input type="password" name="password"
                                                        value={this.state.LoginViewModel.Password || ""}
                                                        onChange={v => this.setState({
                                                            LoginViewModel: {
                                                                Password: v.target["value"],
                                                                UserName: this.state.LoginViewModel.UserName,
                                                                Remember: this.state.LoginViewModel.IsRememberMe
                                                            }
                                                        }, () => store.dispatch(action_PasswordValidate(this.state.LoginViewModel.Password)))} />
                                                    {this.state.Password_Invalid ? <em id="password-error" className="invalid">{this.state.Password_Invalid_MSG}</em> : null}
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-lock txt-color-teal"></i> Nhập mật khẩu của bạn</b> </label>
                                                <div className="note">
                                                    <a href="forgotpassword.html">Quên mật khẩu?</a>
                                                </div>
                                            </section>

                                            <section>
                                                <label className="checkbox">
                                                    <input type="checkbox" name="remember" onChange={v => (
                                                        this.setState({
                                                            LoginViewModel: {
                                                                UserName: this.state.LoginViewModel.UserName,
                                                                Password: this.state.LoginViewModel.Password,
                                                                IsRememberMe: true
                                                            }
                                                        }))} defaultChecked={false} />
                                                    <i></i>Duy trì đăng nhập</label>
                                            </section>
                                        </fieldset>
                                        <footer>
                                            <button type="button" onClick={() => {
                                                let model: LoginViewModel = {
                                                    UserName: this.state.LoginViewModel.UserName,
                                                    Password: this.state.LoginViewModel.Password,
                                                    IsRememberMe: this.state.LoginViewModel.IsRememberMe
                                                };
                                                store.dispatch(action_Login(model));
                                            }} className="btn btn-primary">Đăng nhập</button>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}