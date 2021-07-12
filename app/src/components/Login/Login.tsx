/**
 *  Author: JuanJosé Conejo Sanabria
 *  Description: Login
 */

import React, { useState, Fragment, useRef } from "react";
import LoginService from "./../../services/LoginService";
import { ClassicSpinner } from "react-spinners-kit";
import { loginDto } from "./../../models/login";
import { useHistory } from "react-router-dom";
import { Toast } from 'primereact/toast';
import './Login.css';

const Login = () => {

    let history = useHistory();
    const [user, setuser] = useState("");
    const [pass, setpass] = useState("");
    const [load, setload] = useState(false);
    const service = new LoginService();
    const toast: any = useRef(null);


    const login = async () => {
        try {

            setload(true);
            let data = new loginDto();
            data.user1 = user;
            data.pass = pass;
            const response = await service.Login(data);

            if (response.code === "00") {

                setTimeout(() => {
                    localStorage.setItem("name", response.data.name);
                    localStorage.setItem("token", `Bearer ${response.data.token}`);
                    history.push("/Home");
                    setload(false);
                }, 4000);

            } else {

                setload(false);
                toast.current.show({severity:'info', summary: 'Info Message', detail:'Usuario o pass invalido', life: 3000});

            }

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <Fragment>
            <Toast ref={toast} />
            <div className="container-fluid">
                <div className="row loading">
                    {load && <ClassicSpinner size={100} color="#268EFC" loading={load} />}
                </div>
                <div className="row no-gutter">
                    <div className="col-md-6 d-none d-md-flex bg-image"></div>
                    <div className="col-md-6 bg-light">
                        <div className="login d-flex align-items-center py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-10 col-xl-7 mx-auto">
                                        <h3 className="display-4">Page Login!</h3>
                                        <p className="text-muted mb-4">Create a login Bootstrap 4.</p>
                                        <div className="form-group mb-3">
                                            <input id="user"
                                                name="user"
                                                type="text"
                                                placeholder="user"
                                                className="form-control rounded-pill border-0 shadow-sm px-4"
                                                onChange={(e) => setuser(e.target.value)} />
                                        </div>

                                        <div className="form-group mb-3">
                                            <input id="pass"
                                                name="pass"
                                                type="password"
                                                placeholder="password"
                                                className="form-control rounded-pill border-0 shadow-sm px-4"
                                                onChange={(e) => setpass(e.target.value)} />
                                        </div>

                                        <button type="button" className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm" onClick={() => login()}>Ingresar</button>

                                        <div className="text-center d-flex justify-content-between mt-4">
                                            <p>Code by_<u>JJCS</u></p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>


    );
}

export default Login;
