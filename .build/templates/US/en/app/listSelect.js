(function(){dust.register("app/listSelect",body_0);function body_0(chk,ctx){return chk.write("<select id=\"listSelect\" style=\"width:100%\">").section(ctx.get(["data"], false),ctx,{"block":body_1},null).write("</select>");}function body_1(chk,ctx){return chk.write("<option value=\"").reference(ctx.get(["id"], false),ctx,"h").write("\">").reference(ctx.get(["name"], false),ctx,"h").write("</option>");}return body_0;})();