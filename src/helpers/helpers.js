const hbs = require('hbs');
const Estudiante = require('./../models/estudiante')
const UserPerCourse = require('./../models/userPerCourse')
const Curso = require('./../models/curso')
const bcrypt = require('bcrypt');
var resultgeneral;

let setResultado = (res) => {
    resultgeneral = res;
    //console.log(resultgeneral)
}

let getResultado = (callback) => {

    setTimeout(function () {
        callback(resultgeneral);
    }, 1000)

}
const registrarUsuario = (user, callback) => {
    let estudiante = new Estudiante({
        documento: user.documento,
        correo: user.correo,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: 'Aspirante',
        password: bcrypt.hashSync(user.password, 10)
    });

    Estudiante.find({ documento: user.documento }).exec((err, duplicado) => {
        if (err) {
            return console.log(err)
        }
        if (duplicado.length == 0) {
            estudiante.save((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
            })
            setResultado(
                `<img src="http://appys.com.co/html/software/imagenes/chulo.png" class="img-fluid"
            alt="Responsive image"><br>
            <h1>REGISTRO EXITOSO</h1><br>`)
        } else {
            setResultado(
                `<img src="https://t3.ftcdn.net/jpg/00/80/38/24/240_F_80382483_GWiqEyP0JZKhXyOUEnKz4sqzcns656GB.jpg" class="img-fluid"
                alt="Responsive image"><br>
                <h1>EL USUARIO YA ESTA REGISTRADO</h1><br>`)
        }

        getResultado(function (resultado) {
            callback(resultado);
        });
    })
}
const crearC = (curso, callback) => {

    let curs = new Curso({
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        modalidad: curso.modalidad,
        id: curso.id,
        valor: curso.valor,
        intensidad: curso.intensidad,
        estado: 'Disponible'

    });

    Curso.find({ id: curso.id }).exec((err, duplicado) => {

        if (duplicado.length == 0) {
            curs.save((err, resultado) => {
                if (err) {
                    return console.log(err);
                }
            })

            setResultado(`<div class="alert alert-success" role="alert">Curso creado con exito</div>`);
        } else
            setResultado('<div class="alert alert-danger" role="alert">Ya existe otro curso con este id</div>');

    })
    setTimeout(function () {
        callback(resultgeneral);
    }, 1000)

}

const crearU = (user, callback) => {

    let estudiante = new Estudiante({
        documento: user.documento,
        correo: user.correo,
        nombre: user.nombre,
        telefono: user.telefono,

    });

    let userPerCourse = new UserPerCourse({
        documento: user.documento,
        curso: ((user.curso).split('---'))[0]
    });

    Estudiante.find({ documento: user.documento }).exec((err, duplicado) => {
        if (err) {
            return console.log(err)
        }
        if (duplicado.length == 0) {
            estudiante.save((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
            })
            userPerCourse.save((err, resultado) => {
                if (err) {
                    return console.log(err)
                }
            })
            setResultado(
                `<div class="alert alert-success" role="alert">
                Se crea usuario con exito y se registra en el curso
            </div>`)
        } else {

            UserPerCourse.find({ documento: userPerCourse.documento, curso: userPerCourse.curso }).exec((err, cursoduplicado) => {
                if (cursoduplicado.length == 0) {
                    userPerCourse.save((err, resultado) => {
                        if (err) {
                            return console.log(err)
                        }
                    })
                    setResultado(`
                <div class="alert alert-warning" role="alert">
                    Ya existe el usuario con este documento registrado,Pero se registra en el curso
                    </div>
                    `)
                } else {
                    setResultado(
                        `<div class="alert alert-danger" role="alert">
                        Ya existe el usuario con este documento registrado y con este curso registrado
                    </div>`);
                }
            })


        }
    })

    getResultado(function (resultado) {
        callback(resultado);
    })

}

const cambiarEstadoC = (curso) => {
    Curso.findOneAndUpdate({ id: curso.id }, { estado: curso.estado }, { new: true }, (err, resultado) => {
        if (err) {
            return console.log(err);
        }
    })
}

const eliminarUsuarioDeCurso = (usuario) => {
    UserPerCourse.findOneAndDelete({ documento: usuario.documento, id: usuario.id }, usuario, (err, resultado) => {
        if (err) {
            return console.log(err);
        }
    })
}

const listaCursos = (callback) => {
    //hbs.registerHelper('listaCursos', () => {


    Curso.find({ estado: 'Disponible' }).exec((err, disponibles) => {
        text = ""

        if (!disponibles) {
            text = ""
        } else {
            disponibles.forEach(cur => {
                text = text + `
                <option id='${cur.id}'>${cur.id}---${cur.nombre}</option>
            `})

        }
        setResultado(text)
    })


    getResultado(function (resultado) {
        callback(resultado);
    });

}

const listarCDisponibles = (callback) => {

    //hbs.registerHelper('listarCDisponibles', (callback) => {


    Curso.find({ estado: 'Disponible' }).exec((err, disponibles) => {
        let text = '<div class="accordion" id="accordionExample">';
        let i = 1;
        if (disponibles.length == 0) {
            text = "<p>No se han registrado Cursos</p>"
        } else {
            disponibles.forEach(cur => {
                text = text +
                    `<div class="card">
                <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    Nombre de el curso: ${cur.nombre}<br> 
                    Descripcion del curso: ${cur.descripcion}<br>
                    Valor del Curso: ${cur.valor}<br>
                    </button>
                </h2>
                </div>
            
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                Descripcion del curso: ${cur.descripcion}<br>
                Modalidad del curso: ${cur.modalidad}<br>
                Intensidad del Curso: ${cur.intensidad} <br> 
        
                </div>
                </div>
                </div>
            `
                i++;
            });
        }
        setResultado(text + '</div>')

    })


    getResultado(function (resultado) {
        callback(resultado);
    });


};

const gestionarCurso = (callback) => {
    //hbs.registerHelper('gestionarCurso', () => {


    Curso.find({}).exec((err, listaCursos) => {
        
        let text = '<div class="accordion" id="accordionExample">';
        let i = 1;
        listaCursos.forEach(x => {
            if (x.estado == 'Disponible') {
                color = 'success'
            } else {
                color = 'danger'
            }
            let personas;
            
            
            //personasEnCurso(x, function (per) {
             //   personas=per
            //});

            UserPerCourse.find({ curso: x.id }).exec((err, inscritos) => {
                resultado = `<table class="table">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Id</th>
                    <th scope="col">Accion</th>
                </tr>
                </thead>
                <tbody>`
                let j= 1;
                inscritos.forEach(curxx => {
        
                    Estudiante.find({ documento: curxx.documento }).exec((err, persona) => {
                        resultado = resultado +
                            ` <form method="post"   action="/gestionCurso">
                            <input type="text" name='id' hidden readonly class="form-control-plaintext" id="staticEmail" value="${x.id}">
                            <tr>
                            <th scope="row">${j}</th>
                                <td>
                                    <input type="text" name='nombre' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].nombre}">
                                </td>
                                <td>
                                    <input type="text" name='documento' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].documento}">
                                </td>
                            <td><button type="submit" class="btn btn-danger">Eliminar</button></td>
                        </tr>
                        </form>`
                        j++;
                    })
        
        
                });
                
                personas=(resultado + `</tbody>
                </table>`)
            })
        
        
            


                
                text = text +
                    `<div class="card text-${color} border-${color}">
                <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                <form method="post"   action="/gestionCurso">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    Nombre de el curso
                    <div class="form-group">
                    <input type="text" name='nombre' readonly class="form-control-plaintext" id="staticEmail" value="${x.nombre}">
                    </div>
                    <div class="form-group">
                    <input type="text" name='id' hidden readonly class="form-control-plaintext" id="staticEmail" value="${x.id}">
                    </div>
                    </button>
                </h2>
                
                    <div class="form-group">
                        <label for="estadoCurso">Estado del curso</label>
                            <select class="form-control" id="estadoCurso" name="estado">
                                <option>Disponible</option>
                                <option>Cerrado</option>
                            </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Cambiar estado</button>
                </form>
                </div>
            
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                ${personas}
                </div>
                </div>
                </div>
        `
                
            
            i++;
        });
        setResultado(text + '</div>')
    })


    getResultado(function (resultado) {
        
        callback(resultado);
    });
};

const personasEnCurso = (curso, callback) => {
    
    UserPerCourse.find({ curso: curso.id }).exec((err, inscritos) => {
        resultado = `<table class="table">
        <thead class="thead-dark">
        <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Id</th>
            <th scope="col">Accion</th>
        </tr>
        </thead>
        <tbody>`
        i = 1;
        inscritos.forEach(curxx => {

            Estudiante.find({ documento: curxx.documento }).exec((err, persona) => {
                resultado = resultado +
                    ` <form method="post"   action="/gestionCurso">
                    <input type="text" name='id' hidden readonly class="form-control-plaintext" id="staticEmail" value="${curso.id}">
                    <tr>
                    <th scope="row">${i}</th>
                        <td>
                            <input type="text" name='nombre' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].nombre}">
                        </td>
                        <td>
                            <input type="text" name='documento' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].documento}">
                        </td>
                    <td><button type="submit" class="btn btn-danger">Eliminar</button></td>
                </tr>
                </form>`
                i++;
            })


        });
        
        setResultado(resultado + `</tbody>
        </table>`)
    })


    getResultado(function (resultado) {
        callback(resultado)
    })
}
module.exports = {
    crearC,
    crearU,
    cambiarEstadoC,
    eliminarUsuarioDeCurso,
    registrarUsuario,
    listarCDisponibles,
    listaCursos,
    gestionarCurso
}