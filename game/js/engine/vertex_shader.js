let vs_main = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_world;
uniform mat3 u_object;
uniform vec2 u_frame;
uniform vec2 u_texeloffset;

varying vec2 v_texCoord;
void main(){
    gl_Position = vec4( u_world * u_object * vec3(a_position, 1), 1);
    v_texCoord = a_texCoord + u_frame + u_texeloffset;
}
`;

let vs_backbuffer = `
attribute vec2 a_position; 
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main(){
    gl_Position = vec4(a_position, 1, 1);
    v_texCoord = a_texCoord;
}    
`;