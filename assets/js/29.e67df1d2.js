(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{373:function(t,e,_){"use strict";_.r(e);var v=_(43),a=Object(v.a)({},(function(){var t=this,e=t.$createElement,_=t._self._c||e;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("h1",{attrs:{id:"tcp"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#tcp"}},[t._v("#")]),t._v(" TCP")]),t._v(" "),_("h2",{attrs:{id:"tcp通信"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#tcp通信"}},[t._v("#")]),t._v(" TCP通信")]),t._v(" "),_("h3",{attrs:{id:"三次握手"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#三次握手"}},[t._v("#")]),t._v(" 三次握手")]),t._v(" "),_("ul",[_("li",[t._v("第一次握手：建立连接，客户端发送 SYN = 1 报文，并发送序列号 seq = x，客户端进入 SYN_SEND 状态;")]),t._v(" "),_("li",[t._v("第二次握手：服务端收到第一次握手发送的报文，发送 SYN=1 + ACK=x+1 报文，并发送序列号 seq = y，服务器进入 SYN_RECV 状态;")]),t._v(" "),_("li",[t._v("第三次握手：客户端收到第二次握手发送的报文，发送 ACK = y+1 报文，并发送序列号seq = z，客户端进入连接状态，服务端收到后也进入连接状态。")])]),t._v(" "),_("p",[_("strong",[t._v("为什么握手三次?")]),t._v("\n防止造成服务器资源浪费。")]),t._v(" "),_("p",[t._v("假如客户端的某一个请求在网络中的某个节点滞留了一段时间，本来是一条作废的请求，过了一段时间后到了服务器，这时服务器会认为是一次新的请求，同意建立连接后，此时客户端已经把这条连接作废了，所以造成服务器资源浪费。")]),t._v(" "),_("h3",{attrs:{id:"四次挥手"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#四次挥手"}},[t._v("#")]),t._v(" 四次挥手")]),t._v(" "),_("ul",[_("li",[t._v("第一次挥手：客户端向服务端发起 FIN + ACK 报文和序列号 seq，表示客户端没有数据发送给服务端了;")]),t._v(" "),_("li",[t._v("第二次挥手：服务端向客户端发送 ACK 报文和序列号 seq，表示同意此次断开连接;")]),t._v(" "),_("li",[t._v("第三次挥手：服务端向客户端发送 FIN + ACK 报文和序列号 seq，表示服务端没有数据发送给客户端了;")]),t._v(" "),_("li",[t._v("第四次挥手：客户端向服务端发送ACK报文和序列号seq，表示同意此次断开连接，等待2MSL后断开连接。")])]),t._v(" "),_("p",[_("strong",[t._v("为什么挥手四次?")]),_("br"),t._v("\n因为TCP支持全双工通信，前两次挥手只解决了客户端不发送数据到服务端，但是此时服务端还是可以发送数据到客户端，后两次挥手就解决服务端不发送数据到客户端。")]),t._v(" "),_("p",[_("strong",[t._v("为什么要等待2MSL？")]),_("br"),t._v("\nMSL：报文段的最大生存时间，指任何报文在网络上存在的最长时间，超过这个时间的报文会被丢弃。实际应用常是30秒、1分钟、2分钟。")]),t._v(" "),_("ol",[_("li",[t._v("保证TCP协议的全双工通信能被可靠关闭；"),_("br"),t._v(" "),_("code",[t._v("如果客户端不等待直接关闭，第三次挥手发送的报文可能因为网络原因没有发送到服务端，这时服务端没有收到客户端最后发送的报文，超时后会重新向客户端发送 FIN，但是客户端已经进入关闭状态，不能相对应做出相应处理。")])]),t._v(" "),_("li",[t._v("保证这次连接的重复数据段从网络中消失。")])]),t._v(" "),_("hr"),t._v(" "),_("h2",{attrs:{id:"tcp、udp-的区别"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#tcp、udp-的区别"}},[t._v("#")]),t._v(" TCP、UDP 的区别")]),t._v(" "),_("table",[_("thead",[_("tr",[_("th",[t._v("说明")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("TCP")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("UDP")])])]),t._v(" "),_("tbody",[_("tr",[_("td",[t._v("可靠性")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("可靠")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("不可靠")])]),t._v(" "),_("tr",[_("td",[t._v("连接性")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("面向连接")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("无连接")])]),t._v(" "),_("tr",[_("td",[t._v("报文")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("面向字节流")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("面向报文")])]),t._v(" "),_("tr",[_("td",[t._v("效率")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("传输效率低")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("传输效率高")])]),t._v(" "),_("tr",[_("td",[t._v("双工性")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("全双工")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("一对一、一对多、多对一、多对多")])]),t._v(" "),_("tr",[_("td",[t._v("流量控制")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("滑动窗口")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("无")])]),t._v(" "),_("tr",[_("td",[t._v("拥塞控制")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("慢开始、拥塞避免、快重传、快恢复")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("无")])]),t._v(" "),_("tr",[_("td",[t._v("应用场景")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("对效率要求低、对准确性要求高")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("效率要求高、准确性要求低")])])])])])}),[],!1,null,null,null);e.default=a.exports}}]);