let fs_main = `
precision mediump float;
uniform sampler2D u_image;
uniform vec4 u_color;
varying vec2 v_texCoord;

void main(){
    gl_FragColor = u_color * texture2D(u_image, v_texCoord);
}
`;

let fs_backbuffer = `
precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;

void main(){
    gl_FragColor = texture2D(u_image, v_texCoord);
}
`;