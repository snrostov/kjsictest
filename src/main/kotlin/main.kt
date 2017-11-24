import kotlin.browser.document

fun main(args: Array<String>) {
  val div = document.getElementById("content")
  div!!.innerHTML = "123"
}