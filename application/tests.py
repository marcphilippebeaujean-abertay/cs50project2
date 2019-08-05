import unittest


class TestURLs(unittest.TestCase):
    def setUp(self):
       print('starting test')

    def test_addition(self):
        assert(1+1 == 2)


if __name__ == '__main__':
    unittest.main()