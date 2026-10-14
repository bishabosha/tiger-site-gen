package revealTheme

class LazyImageChecks extends munit.FunSuite:
  test("slide images defer downloads while preserving markup and existing deferred sources") {
    val html = """<p><img src="/static/photo.png" alt="A photo" width="800" /></p><img class="badge" src="logo.svg"><img data-src="later.svg"><a href="original.png">Expand</a>"""
    val deferred = Slides.lazyImages(html)
    assertEquals(deferred, """<p><img data-src="/static/photo.png" alt="A photo" width="800" /></p><img class="badge" data-src="logo.svg"><img data-src="later.svg"><a href="original.png">Expand</a>""")
    assertEquals(Slides.lazyImages(deferred), deferred)
  }
